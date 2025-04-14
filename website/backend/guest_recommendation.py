import pandas as pd
import numpy as np
from typing import List, Dict
from sklearn.metrics.pairwise import cosine_similarity

class GuestRecommendationEngine:
    """
    Engine for generating recommendations based on guest ratings.
    Uses a memory-based approach to find similar users in the dataset
    and generate recommendations without requiring the guest to have an account.
    """
    
    def __init__(self, ratings_df, books_df, users_df=None):
        """
        Initialize the guest recommendation engine.
        
        Parameters:
        -----------
        ratings_df : pandas.DataFrame
            DataFrame containing user ratings
        books_df : pandas.DataFrame
            DataFrame containing book information
        users_df : pandas.DataFrame, optional
            DataFrame containing user information
        """
        self.ratings_df = ratings_df
        self.books_df = books_df
        self.users_df = users_df
        
        # Create a pivot table of user ratings for faster similarity calculation
        self.user_item_matrix = self.ratings_df.pivot(
            index='User-ID',
            columns='ISBN',
            values='Book-Rating'
        ).fillna(0)
    
    def find_similar_users(self, guest_ratings: Dict[str, int], k: int = 10) -> List[int]:
        """
        Find users most similar to the guest based on provided ratings.
        
        Parameters:
        -----------
        guest_ratings : Dict[str, int]
            Dictionary mapping ISBNs to ratings provided by the guest
        k : int
            Number of similar users to find
            
        Returns:
        --------
        List[int]
            List of user IDs most similar to the guest
        """
        # Create a guest user vector
        guest_vector = pd.Series(0, index=self.user_item_matrix.columns)
        
        # Fill in the guest ratings
        for isbn, rating in guest_ratings.items():
            if isbn in guest_vector.index:
                guest_vector[isbn] = rating
        
        # Calculate cosine similarity between guest and all users
        similarities = {}
        for user_id in self.user_item_matrix.index:
            user_vector = self.user_item_matrix.loc[user_id]
            
            # Only consider books that either the guest or the user has rated
            mask = (guest_vector > 0) | (user_vector > 0)
            if mask.sum() == 0:  # No overlap
                continue
                
            # Calculate cosine similarity
            user_vector_filtered = user_vector[mask].values.reshape(1, -1)
            guest_vector_filtered = guest_vector[mask].values.reshape(1, -1)
            
            if np.count_nonzero(user_vector_filtered) > 0 and np.count_nonzero(guest_vector_filtered) > 0:
                sim = cosine_similarity(user_vector_filtered, guest_vector_filtered)[0][0]
                similarities[user_id] = sim
        
        # Sort by similarity and return top k
        similar_users = sorted(similarities.items(), key=lambda x: x[1], reverse=True)[:k]
        return [user_id for user_id, _ in similar_users]
    
    def get_recommendations_for_guest(self, guest_ratings: Dict[str, int], n: int = 10) -> pd.DataFrame:
        """
        Generate recommendations for a guest user based on their provided ratings.
        
        Parameters:
        -----------
        guest_ratings : Dict[str, int]
            Dictionary mapping ISBNs to ratings provided by the guest
        n : int
            Number of recommendations to return
            
        Returns:
        --------
        pandas.DataFrame
            DataFrame containing recommended books
        """
        # Find similar users
        similar_users = self.find_similar_users(guest_ratings, k=20)
        
        if not similar_users:
            # If no similar users found, return popular books that the guest hasn't rated
            print("No similar users found. Returning popular books.")
            rated_isbns = set(guest_ratings.keys())
            popularity = self.ratings_df.groupby('ISBN')['Book-Rating'].count().sort_values(ascending=False)
            popular_isbns = [isbn for isbn in popularity.index if isbn not in rated_isbns][:n]
            
            recommendations = self.books_df[self.books_df['ISBN'].isin(popular_isbns)].head(n)
            return recommendations
        
        # Get books rated by similar users
        similar_user_ratings = self.ratings_df[self.ratings_df['User-ID'].isin(similar_users)]
        
        # Exclude books already rated by the guest
        rated_isbns = set(guest_ratings.keys())
        candidate_ratings = similar_user_ratings[~similar_user_ratings['ISBN'].isin(rated_isbns)]
        
        # Rank books by frequency and average rating
        book_stats = candidate_ratings.groupby('ISBN').agg({
            'Book-Rating': ['count', 'mean']
        })
        book_stats.columns = ['rating_count', 'rating_mean']
        
        # Normalize counts and ratings
        book_stats['rating_count_norm'] = book_stats['rating_count'] / book_stats['rating_count'].max()
        book_stats['rating_mean_norm'] = book_stats['rating_mean'] / 10  # Assuming 10 is max rating
        
        # Calculate a score combining popularity and rating
        book_stats['score'] = book_stats['rating_count_norm'] * 0.6 + book_stats['rating_mean_norm'] * 0.4
        
        # Get top n recommendations
        top_books = book_stats.sort_values('score', ascending=False).head(n)
        
        # Get book details
        recommendations = self.books_df[self.books_df['ISBN'].isin(top_books.index)]
        
        # Merge with scores
        recommendations = recommendations.merge(
            top_books.reset_index()[['ISBN', 'rating_mean']], 
            on='ISBN'
        )
        
        # Rename rating_mean to Rating for consistent output schema
        recommendations = recommendations.rename(columns={'rating_mean': 'Rating'})
        
        return recommendations

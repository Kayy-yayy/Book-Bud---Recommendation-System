import pandas as pd
import numpy as np
from typing import List, Dict
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix

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
        pivot_df = self.ratings_df.pivot(
            index='User-ID',
            columns='ISBN',
            values='Book-Rating'
        ).fillna(0)
        
        # Convert to sparse matrix for efficiency
        self.user_item_matrix = csr_matrix(pivot_df.values)
        self.user_id_map = {i: user_id for i, user_id in enumerate(pivot_df.index)}
        self.isbn_map = {i: isbn for i, isbn in enumerate(pivot_df.columns)}
        self.isbn_to_idx = {isbn: i for i, isbn in enumerate(pivot_df.columns)}
        self.n_users, self.n_items = self.user_item_matrix.shape
    
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
        # Create a sparse guest user vector
        guest_data = []
        guest_row_indices = []
        guest_col_indices = []
        
        valid_ratings_count = 0
        for isbn, rating in guest_ratings.items():
            if isbn in self.isbn_to_idx:
                guest_data.append(rating)
                guest_row_indices.append(0)
                guest_col_indices.append(self.isbn_to_idx[isbn])
                valid_ratings_count += 1
        
        if valid_ratings_count == 0:
            return [] # Guest rated books not in our dataset
            
        guest_vector = csr_matrix((guest_data, (guest_row_indices, guest_col_indices)), shape=(1, self.n_items))
        
        # Calculate cosine similarity between guest and all users (vectorized)
        similarities = cosine_similarity(guest_vector, self.user_item_matrix)[0] # Get the first (and only) row
        
        # Get indices of top k similar users (excluding the guest itself if they were somehow in the matrix)
        # Argsort returns indices that would sort the array in ascending order
        # We want descending, so we use negative similarities or reverse the result
        similar_user_indices = np.argsort(similarities)[::-1][:k]
        
        # Map indices back to User-IDs, filtering out users with zero similarity
        similar_users = [
            self.user_id_map[idx] 
            for idx in similar_user_indices 
            if similarities[idx] > 0
        ]
        
        return similar_users
    
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

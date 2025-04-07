from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import os
import sys
import uvicorn
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# Add multiple possible paths to find the recommendation modules
possible_paths = [
    os.path.dirname(os.path.abspath(__file__)),  # Current directory
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),  # Root project directory
    '/app',  # Railway app directory
    '/app/website/backend',  # Railway backend directory
    '.',  # Current working directory
]

for path in possible_paths:
    if path not in sys.path:
        sys.path.append(path)
        print(f"Added {path} to sys.path")

# Print current sys.path for debugging
print(f"sys.path: {sys.path}")

# Print current directory contents for debugging
print(f"Current directory contents: {os.listdir(os.path.dirname(os.path.abspath(__file__)))}")

# Import recommendation system modules
try:
    from data_preprocessing import DataPreprocessor
    from content_based import ContentBasedRecommender
    from collaborative_filtering import CollaborativeFilteringRecommender
    from popularity_based import PopularityRecommender
    print("Successfully imported all recommendation modules")
except ImportError as e:
    print(f"Import error: {e}")
    # Try to find the modules in the current directory
    module_files = [f for f in os.listdir(os.path.dirname(os.path.abspath(__file__))) if f.endswith('.py')]
    print(f"Python files in current directory: {module_files}")

app = FastAPI(title="Book Bud API", description="API for Book Bud Recommendation System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Data paths
# Check for data files in multiple possible locations
for data_dir in ['/data', '/app', '/app/website/backend', '.', '..', '../..']:
    books_path = os.path.join(data_dir, "Books.csv")
    ratings_path = os.path.join(data_dir, "Ratings.csv")
    users_path = os.path.join(data_dir, "Users.csv")
    
    if os.path.exists(books_path) and os.path.exists(ratings_path) and os.path.exists(users_path):
        print(f"Found data files in {data_dir}")
        BOOKS_PATH = books_path
        RATINGS_PATH = ratings_path
        USERS_PATH = users_path
        break
else:
    # Fallback to original paths if not found anywhere
    print("Using default data file paths...")
    BOOKS_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "Books.csv")
    RATINGS_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "Ratings.csv")
    USERS_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "Users.csv")

print(f"Using data files from: {BOOKS_PATH}")

# Initialize data and models
preprocessor = None
content_recommender = None
collaborative_recommender = None
popularity_recommender = None

# Models initialization flag
models_initialized = False

# Pydantic models for request/response
class BookResponse(BaseModel):
    ISBN: str
    Title: str
    Author: str
    Year: Optional[int] = None
    Publisher: Optional[str] = None
    ImageURL: Optional[str] = None
    Rating: Optional[float] = None

class RecommendationRequest(BaseModel):
    book_title: Optional[str] = None
    book_isbn: Optional[str] = None
    author: Optional[str] = None
    user_id: Optional[int] = None
    limit: int = 10

@app.on_event("startup")
async def startup_event():
    global preprocessor, content_recommender, collaborative_recommender, popularity_recommender, models_initialized
    
    try:
        print("Loading and preprocessing data...")
        preprocessor = DataPreprocessor(BOOKS_PATH, RATINGS_PATH, USERS_PATH)
        preprocessor.load_data().clean_books_data().clean_ratings_data().clean_users_data().merge_data()
        
        print("Initializing recommendation models...")
        # Initialize content-based recommender
        content_recommender = ContentBasedRecommender(preprocessor.books_processed)
        content_recommender.fit()
        
        # Initialize collaborative filtering recommender
        collaborative_recommender = CollaborativeFilteringRecommender(
            preprocessor.ratings_processed, preprocessor.books_processed
        )
        collaborative_recommender.fit(min_user_ratings=10, min_book_ratings=5)
        
        # Initialize popularity-based recommender
        popularity_recommender = PopularityRecommender(
            preprocessor.ratings_processed, preprocessor.books_processed
        )
        popularity_recommender.fit(min_ratings=5)
        
        models_initialized = True
        print("All models initialized successfully!")
    except Exception as e:
        print(f"Error initializing models: {str(e)}")

def convert_to_response(df):
    """Convert DataFrame to list of BookResponse objects"""
    books = []
    for _, row in df.iterrows():
        book = {
            "ISBN": row.get("ISBN", ""),
            "Title": row.get("Book-Title", "Unknown Title"),
            "Author": row.get("Book-Author", "Unknown Author"),
            "Year": int(row.get("Year-Of-Publication", 0)) if pd.notna(row.get("Year-Of-Publication", None)) else None,
            "Publisher": row.get("Publisher", None),
            "ImageURL": row.get("Image-URL-L", None),
            "Rating": float(row.get("rating_mean", 0)) if pd.notna(row.get("rating_mean", None)) else None
        }
        books.append(book)
    return books

@app.get("/")
async def root():
    return {"message": "Welcome to Book Bud API", "status": "active"}

@app.get("/status")
async def status():
    return {
        "status": "ready" if models_initialized else "initializing",
        "models": {
            "content_based": content_recommender is not None,
            "collaborative_filtering": collaborative_recommender is not None,
            "popularity_based": popularity_recommender is not None
        }
    }

@app.get("/popular-books", response_model=List[Dict[str, Any]])
async def get_popular_books(
    limit: int = Query(10, ge=1, le=50),
    criteria: str = Query("popularity_score", regex="^(popularity_score|rating_count|rating_mean)$")
):
    if not models_initialized:
        raise HTTPException(status_code=503, detail="Models are still initializing")
    
    recommendations = popularity_recommender.recommend(n=limit, criteria=criteria)
    return convert_to_response(recommendations)

@app.get("/popular-by-year", response_model=List[Dict[str, Any]])
async def get_popular_by_year(
    year: int = Query(..., ge=1800, le=2025),
    limit: int = Query(10, ge=1, le=50),
    criteria: str = Query("popularity_score", regex="^(popularity_score|rating_count|rating_mean)$")
):
    if not models_initialized:
        raise HTTPException(status_code=503, detail="Models are still initializing")
    
    recommendations = popularity_recommender.recommend_by_year(year, n=limit, criteria=criteria)
    return convert_to_response(recommendations)

@app.get("/popular-by-publisher", response_model=List[Dict[str, Any]])
async def get_popular_by_publisher(
    publisher: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    criteria: str = Query("popularity_score", regex="^(popularity_score|rating_count|rating_mean)$")
):
    if not models_initialized:
        raise HTTPException(status_code=503, detail="Models are still initializing")
    
    recommendations = popularity_recommender.recommend_by_publisher(publisher, n=limit, criteria=criteria)
    return convert_to_response(recommendations)

@app.get("/content-based", response_model=List[Dict[str, Any]])
async def get_content_based_recommendations(
    title: Optional[str] = None,
    isbn: Optional[str] = None,
    author: Optional[str] = None,
    limit: int = Query(10, ge=1, le=50)
):
    if not models_initialized:
        raise HTTPException(status_code=503, detail="Models are still initializing")
    
    if not any([title, isbn, author]):
        raise HTTPException(status_code=400, detail="At least one of title, isbn, or author must be provided")
    
    if isbn:
        recommendations = content_recommender.get_recommendations(isbn, n=limit)
    elif title:
        recommendations = content_recommender.get_recommendations_by_title(title, n=limit)
    elif author:
        recommendations = content_recommender.get_recommendations_by_author(author, n=limit)
    
    if recommendations.empty:
        return []
    
    return convert_to_response(recommendations)

@app.get("/collaborative-filtering", response_model=List[Dict[str, Any]])
async def get_collaborative_recommendations(
    user_id: int = Query(...),
    method: str = Query("user", regex="^(user|item)$"),
    limit: int = Query(10, ge=1, le=50)
):
    if not models_initialized:
        raise HTTPException(status_code=503, detail="Models are still initializing")
    
    try:
        if method == "user":
            recommendations = collaborative_recommender.user_based_recommendations(user_id, n=limit)
        else:
            recommendations = collaborative_recommender.item_based_recommendations(user_id, n=limit)
        
        if recommendations.empty:
            return []
        
        return convert_to_response(recommendations)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Error generating recommendations: {str(e)}")

@app.get("/search-books", response_model=List[Dict[str, Any]])
async def search_books(
    query: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=100)
):
    if not models_initialized:
        raise HTTPException(status_code=503, detail="Models are still initializing")
    
    # Search in titles, authors, and publishers
    query = query.lower()
    results = preprocessor.books_processed[
        preprocessor.books_processed['Book-Title'].str.lower().str.contains(query) |
        preprocessor.books_processed['Book-Author'].str.lower().str.contains(query) |
        preprocessor.books_processed['Publisher'].str.lower().str.contains(query)
    ]
    
    return convert_to_response(results.head(limit))

@app.get("/eda-stats")
async def get_eda_stats():
    if not models_initialized:
        raise HTTPException(status_code=503, detail="Models are still initializing")
    
    # Return basic statistics about the dataset
    return {
        "total_books": len(preprocessor.books_processed),
        "total_users": len(preprocessor.users_processed),
        "total_ratings": len(preprocessor.ratings_processed),
        "avg_rating": float(preprocessor.ratings_processed["Book-Rating"].mean()),
        "rating_distribution": preprocessor.ratings_processed["Book-Rating"].value_counts().to_dict(),
        "publication_years": {
            "min": int(preprocessor.books_processed["Year-Of-Publication"].min()),
            "max": int(preprocessor.books_processed["Year-Of-Publication"].max()),
            "most_common": int(preprocessor.books_processed["Year-Of-Publication"].value_counts().index[0])
        },
        "top_authors": preprocessor.books_processed["Book-Author"].value_counts().head(10).to_dict(),
        "top_publishers": preprocessor.books_processed["Publisher"].value_counts().head(10).to_dict()
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

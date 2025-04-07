# Book Bud - Book Recommendation System

A sophisticated book recommendation system with a modern web interface. This project showcases multiple recommendation approaches including popularity-based, content-based, and collaborative filtering.

## Project Structure

The project consists of two main components:

### Backend (Python FastAPI)

- Implements the recommendation algorithms
- Provides API endpoints for the frontend
- Processes and serves book recommendations

### Frontend (Next.js)

- Modern, responsive UI built with Next.js and Tailwind CSS
- Interactive components using Aceternity UI elements
- Visualizations of book recommendations and data analysis

## Features

- **Popularity-Based Recommendations**: Discover trending and highly-rated books
- **Content-Based Recommendations**: Find books similar to ones you already enjoy
- **Collaborative Filtering**: Get personalized recommendations based on user behavior
- **Exploratory Data Analysis**: Visualizations and insights from the book dataset

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Package managers: npm (for frontend) and pip (for backend)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd website/backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```
   python app.py
   ```

   The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd website/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

   The website will be available at http://localhost:3000

## API Endpoints

- `/popular-books` - Get popular books based on different criteria
- `/popular-by-year` - Get popular books by publication year
- `/popular-by-publisher` - Get popular books by publisher
- `/content-based` - Get content-based recommendations
- `/collaborative-filtering` - Get collaborative filtering recommendations
- `/search-books` - Search for books by title, author, or publisher
- `/eda-stats` - Get basic statistics about the dataset

## Technologies Used

### Backend
- Python
- FastAPI
- Pandas
- NumPy
- Scikit-learn
- SciPy

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Aceternity UI Components

## Deployment

### Backend Deployment

The backend can be deployed to services like:
- Heroku
- Railway
- Render
- AWS Lambda

### Frontend Deployment

The frontend can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- GitHub Pages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

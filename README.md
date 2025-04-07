# Book Bud Recommendation System

A comprehensive book recommendation system with multiple recommendation approaches and a modern web interface.

## Project Structure

```
Book Bud - Recommendation System/
├── Books.csv                  # Book dataset
├── Ratings.csv                # User ratings dataset
├── Users.csv                  # User information dataset
├── collaborative_filtering.py # Collaborative filtering algorithm
├── content_based.py           # Content-based recommendation algorithm
├── data_preprocessing.py      # Data preprocessing utilities
├── eda_analysis.py            # Exploratory data analysis
├── popularity_based.py        # Popularity-based recommendation algorithm
└── website/                   # Web application
    ├── backend/               # FastAPI backend
    └── frontend/              # Next.js frontend
```

## Features

- **Multiple Recommendation Approaches**:
  - Popularity-based recommendations
  - Content-based recommendations
  - Collaborative filtering recommendations
- **Exploratory Data Analysis (EDA)** visualization
- **Modern UI** built with Next.js and Tailwind CSS
- **RESTful API** built with FastAPI

## Local Development

### Backend Setup

```bash
# Navigate to the backend directory
cd website/backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn app:app --reload
```

The API will be available at http://localhost:8000 with documentation at http://localhost:8000/docs

### Frontend Setup

```bash
# Navigate to the frontend directory
cd website/frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at http://localhost:3000

## Deployment Instructions

### Backend Deployment (Railway)

#### Basic Deployment

1. Create a Railway account at [railway.app](https://railway.app/)
2. Install the Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```
3. Login to Railway:
   ```bash
   railway login
   ```
4. Navigate to the backend directory:
   ```bash
   cd website/backend
   ```
5. Create a new Railway project:
   ```bash
   railway init
   ```
6. Deploy the backend:
   ```bash
   railway up
   ```
7. Get your backend URL:
   ```bash
   railway domain
   ```

Alternatively, you can connect your GitHub repository to Railway for automatic deployments:
1. Push your code to GitHub
2. In Railway dashboard, create a new project from GitHub
3. Select your repository and the backend directory
4. Railway will automatically detect and deploy your FastAPI application

#### Setting Up Railway Volumes for CSV Data

Since the CSV files are large and excluded from Git, you'll need to set up a Railway volume to store them:

##### Prerequisites

- Railway CLI installed (`npm install -g @railway/cli`)
- Your CSV files (Books.csv, Ratings.csv, Users.csv)
- A Railway account

##### Step 1: Create a Railway Volume

```bash
railway volume create book-data
```

##### Step 2: Link Your Local Repository to Your Railway Project

```bash
railway link
```

##### Step 3: Upload Your CSV Files to the Volume

First, create a temporary upload script:

```bash
# Create a script to upload files
echo '#!/bin/bash
mkdir -p /data
cp /tmp/Books.csv /data/
cp /tmp/Ratings.csv /data/
cp /tmp/Users.csv /data/
echo "Files copied to volume successfully!"
ls -la /data' > upload.sh

# Make it executable
chmod +x upload.sh
```

Then, upload your CSV files:

```bash
# Copy your local CSV files to the temporary location
railway run --volume book-data cp Books.csv /tmp/
railway run --volume book-data cp Ratings.csv /tmp/
railway run --volume book-data cp Users.csv /tmp/

# Run the upload script
railway run --volume book-data ./upload.sh
```

##### Step 4: Configure Your Railway Project to Use the Volume

In the Railway dashboard:

1. Go to your project
2. Click on "Variables"
3. Add a mount:
   - Volume: book-data
   - Mount Path: /data

##### Step 5: Deploy Your Application

```bash
railway up
```

##### Verification

To verify that your files are correctly mounted and accessible:

```bash
# Connect to your running service
railway connect

# Check if files exist
ls -la /data
```

You should see your CSV files listed in the /data directory.

##### Troubleshooting

If your files aren't visible or your application can't access them:

1. Make sure the volume is properly mounted at `/data`
2. Check the Railway logs for any file access errors
3. Verify that your application has the correct permissions to read from the volume

##### Alternative Upload Method (if the above doesn't work)

If you're having trouble with the direct upload method, you can also:

1. Deploy a temporary service with the volume mounted
2. Use Railway's SFTP feature to upload files
3. Then connect your main service to the same volume

```bash
# Deploy a temporary service
railway service create temp-file-uploader
railway service link temp-file-uploader
railway variables set --service temp-file-uploader VOLUME_MOUNT=/data
railway volume link book-data --service temp-file-uploader

# Get SFTP credentials
railway sftp --service temp-file-uploader
```

Use the SFTP credentials with your favorite SFTP client to upload the files, then delete the temporary service when done.

### Frontend Deployment (Vercel)

1. Create a Vercel account at [vercel.com](https://vercel.com/)
2. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```
3. Login to Vercel:
   ```bash
   vercel login
   ```
4. Navigate to the frontend directory:
   ```bash
   cd website/frontend
   ```
5. Deploy the frontend:
   ```bash
   vercel
   ```
6. Set the environment variable for your backend URL:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   ```
   Enter your Railway backend URL when prompted

Alternatively, you can connect your GitHub repository to Vercel for automatic deployments:
1. Push your code to GitHub
2. In Vercel dashboard, import your repository
3. Set the root directory to `website/frontend`
4. Add the environment variable `NEXT_PUBLIC_API_URL` with your Railway backend URL

## API Endpoints

- `/popular-books`: Get popular books based on various criteria
- `/popular-by-year`: Get popular books by publication year
- `/popular-by-publisher`: Get popular books by publisher
- `/content-based`: Get content-based recommendations
- `/collaborative-filtering`: Get collaborative filtering recommendations
- `/search-books`: Search for books by title, author, or ISBN
- `/eda-stats`: Get exploratory data analysis statistics

## Technologies Used

- **Backend**:
  - FastAPI
  - Pandas
  - NumPy
  - Scikit-learn
  - SciPy
  - Matplotlib
  - Seaborn

- **Frontend**:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Aceternity UI components

## License

MIT

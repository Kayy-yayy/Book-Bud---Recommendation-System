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

### Backend Deployment (Render)

#### Basic Deployment

1. Create a Render account at [render.com](https://render.com/)
2. Push your code to GitHub
3. In the Render dashboard, create a new Web Service
4. Connect your GitHub repository
5. Configure the service with the following settings:
   - **Name**: book-bud-backend
   - **Environment**: Python
   - **Build Command**: `pip install -r website/backend/requirements.txt && cp *.py website/backend/`
   - **Start Command**: `cd website/backend && uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**: Add `PYTHON_VERSION=3.9.18`

Alternatively, you can use the `render.yaml` file in the repository for automatic configuration:

```bash
# From the repository root, push to GitHub
git add .
git commit -m "Add Render configuration"
git push
```

Then in the Render dashboard, select "Blueprint" when creating a new service and connect to your GitHub repository.

#### Setting Up CSV Data Files on Render

Since the CSV files are large and excluded from Git, you'll need to set up a Render Disk to store them:

##### Prerequisites

- Your CSV files (Books.csv, Ratings.csv, Users.csv)
- A Render account with a paid plan (Disks are not available on the free plan)

##### Step 1: Create a Render Disk

1. In the Render dashboard, go to "Disks" in the left sidebar
2. Click "New Disk"
3. Configure the disk:
   - **Name**: book-data
   - **Size**: Choose appropriate size (at least 1GB)
   - **Mount Path**: `/data`
   - **Service**: Select your backend service

##### Step 2: Upload Your CSV Files

After creating the disk and attaching it to your service:

1. SSH into your Render service from the dashboard
2. Create the data directory if it doesn't exist:
   ```bash
   mkdir -p /data
   ```
3. Use SFTP to upload your CSV files to the `/data` directory

Alternatively, you can use the Render shell to download the files directly:

```bash
# From the Render shell
cd /data
curl -O https://your-storage-url/Books.csv
curl -O https://your-storage-url/Ratings.csv
curl -O https://your-storage-url/Users.csv
```

##### Verification

To verify that your files are correctly mounted and accessible:

```bash
# From the Render shell
ls -la /data
```

You should see your CSV files listed in the /data directory.

### Frontend Deployment (Netlify)

1. Create a Netlify account at [netlify.com](https://netlify.com/)
2. Push your code to GitHub
3. In the Netlify dashboard, click "New site from Git"
4. Connect your GitHub repository
5. Configure the build settings:
   - **Base directory**: `website/frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Add the environment variable for your backend URL:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Your Render backend URL (e.g., `https://book-bud-backend.onrender.com`)

The repository includes a `netlify.toml` file in the frontend directory that configures the build process automatically.

Alternatively, you can use the Netlify CLI for deployment:

```bash
# Install the Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to the frontend directory
cd website/frontend

# Initialize Netlify site
netlify init

# Deploy the site
netlify deploy --prod
```

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

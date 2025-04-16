FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY website/backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy recommendation system modules
COPY collaborative_filtering.py content_based.py data_preprocessing.py popularity_based.py /app/
COPY website/backend /app/

# Copy CSV data files
COPY Books.csv Ratings.csv Users.csv /app/

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

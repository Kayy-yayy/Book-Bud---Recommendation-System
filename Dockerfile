FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy the entire backend directory
COPY website/backend/ /app/

# Copy recommendation system modules from root to app directory
COPY *.py /app/

# Copy CSV files explicitly
COPY website/backend/Books.csv /app/
COPY website/backend/Ratings.csv /app/
COPY website/backend/Users.csv /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Print directory contents for debugging
RUN ls -la /app

# Expose the port the app runs on
EXPOSE 8000

# Simple startup command that works reliably with Railway
# Use the shell form to ensure environment variables are properly expanded
CMD uvicorn app:app --host 0.0.0.0 --port $PORT

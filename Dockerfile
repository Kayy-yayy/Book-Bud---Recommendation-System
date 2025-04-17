FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy the entire backend directory
COPY website/backend/ /app/

# Copy recommendation system modules from root to app directory
COPY *.py /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
# Use a shell form to ensure environment variable expansion works
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]

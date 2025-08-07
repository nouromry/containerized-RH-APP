# Use official Python image
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy all source code
COPY . .

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5001

# Expose Flask port
EXPOSE 5001

# Run the Flask app
CMD ["flask", "run"]

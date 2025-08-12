# --- STAGE 1: The "Builder" Stage ---
# Use a full Python image to compile and install our dependencies
FROM python:3.10 AS builder

# Set the working directory
WORKDIR /app

# Create a virtual environment to isolate our packages
# This is the standard best practice for Python applications
RUN python -m venv /app/venv

# Copy the requirements file
COPY requirements.txt ./

# Install the dependencies INTO the virtual environment
RUN /app/venv/bin/pip install --no-cache-dir -r requirements.txt

# Copy the rest of our application's source code
COPY . .


# --- STAGE 2: The "Final" Production Stage ---
# Start from a fresh, minimal 'slim' image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Create a non-root user and group for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the virtual environment and the source code from the 'builder' stage
# This brings over Python packages and your code, but nothing else.
COPY --from=builder /app/venv ./venv
COPY --from=builder /app ./

# Activate the virtual environment by adding it to the system's PATH
# This ensures that the 'flask' command can be found
ENV PATH="/app/venv/bin:$PATH"

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5001

# Switch to our new, unprivileged user
USER appuser

# Expose the correct port for the AI model service
EXPOSE 5001

# The command to run the application
CMD ["flask", "run"]
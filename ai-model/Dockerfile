# --- STAGE 1: The "Builder" Stage ---
# Use a full Python image to compile and install our dependencies
FROM python:3.10 AS builder

# Set the working directory
WORKDIR /app

# Create a virtual environment to isolate our packages
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

# --- THIS IS THE CORRECTED LINE ---
# Create a non-root user and group using Debian-compatible commands
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy the virtual environment and the source code from the 'builder' stage
COPY --from=builder /app/venv ./venv
COPY --from=builder /app ./

# Activate the virtual environment by adding it to the system's PATH
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
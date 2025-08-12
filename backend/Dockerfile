# --- STAGE 1: The "Builder" Stage (Our Kitchen) ---
# Use the full Node.js alpine image to build our dependencies
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files. We copy these first to take advantage of Docker's layer caching.
# If these files don't change, Docker won't re-run 'npm ci'.
COPY package*.json ./

# Install ONLY production dependencies. 'npm ci' is faster and more reliable for CI/CD.
# The --omit=dev flag is crucial for security and size.
RUN npm ci --omit=dev

# Copy the rest of our application's source code
COPY . .


# --- STAGE 2: The "Final" Image (Our Serving Plate) ---
# Start from a fresh, minimal alpine image. It's much smaller than the full node image.
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Create a non-root user and group for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy ONLY the necessary files from the 'builder' stage into our new, clean image
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Switch to our new, unprivileged user
USER appuser

# Expose the correct port for the backend service
EXPOSE 5000

# The command to run the application
CMD ["node", "server.js"]
# Use official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy dependency files first and install
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the backend server
CMD ["npm", "start"]

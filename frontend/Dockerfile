# --- Build Stage ---
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files and build the app
COPY . .
RUN npm run build

# --- Production Stage ---
FROM nginx:stable-alpine

# Copy built files to NGINX html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom NGINX config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

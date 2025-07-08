FROM node:24-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code (excluding files from .dockerignore)
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 4000

# Start the app
CMD ["node", "src/server.js"]

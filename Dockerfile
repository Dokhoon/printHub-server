# Use Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port (must match docker-compose)
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]

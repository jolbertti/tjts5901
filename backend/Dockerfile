# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the entire source code
COPY src ./src

# Expose backend port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start the server
CMD ["node", "src/index.js"]
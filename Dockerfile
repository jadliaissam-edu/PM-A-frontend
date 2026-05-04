# Base image
FROM node:20.19-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

# Add npm resilience for flaky networks and use npm ci for consistency
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]

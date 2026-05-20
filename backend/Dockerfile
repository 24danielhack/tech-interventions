# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./

RUN npm ci --only=production

# Copy source code
COPY backend/src ./src
COPY backend/tsconfig.json ./
COPY backend/nest-cli.json ./

# Build application
RUN npm run build

# Expose port
EXPOSE 3001

# Run application
CMD ["npm", "run", "start:prod"]

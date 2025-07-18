FROM node:18-alpine AS base

# Install Python and dependencies
RUN apk add --no-cache python3 py3-pip python3-dev gcc g++ make

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install Node.js dependencies
RUN yarn install --frozen-lockfile

# Install Python dependencies
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
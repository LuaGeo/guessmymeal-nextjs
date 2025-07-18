FROM node:18-alpine AS base

# Install Python and dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    python3-dev \
    gcc \
    g++ \
    make \
    musl-dev \
    linux-headers \
    libffi-dev \
    openssl-dev \
    jpeg-dev \
    zlib-dev \
    freetype-dev \
    lcms2-dev \
    openjpeg-dev \
    tiff-dev \
    tk-dev \
    tcl-dev

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install Node.js dependencies
RUN yarn install --frozen-lockfile

# Create and activate Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies in virtual environment
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
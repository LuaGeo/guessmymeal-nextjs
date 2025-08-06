# CORS Configuration for Railway API

## Problem

Your API on Railway is not configured to accept requests from the frontend, causing CORS errors.

## Solutions

### 1. Temporary Solution (Implemented)

- Created local proxy at `/pages/api/proxy-detect-food.js`
- Works during local development
- Does not affect production deployment
- **Correct endpoint**: `/predict`
- **Correct field**: `file`

### 2. Permanent Solution (Recommended)

Configure CORS in your Railway API:

#### For FastAPI:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://your-frontend.vercel.app",  # Your frontend in production
        "https://your-frontend.netlify.app",  # If using Netlify
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### For Express.js:

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend.vercel.app",
      "https://your-frontend.netlify.app",
    ],
    credentials: true,
  })
);
```

#### For Flask:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "https://your-frontend.vercel.app",
    "https://your-frontend.netlify.app"
])
```

### 3. Production Configuration

When you deploy the frontend, add the production URL to the `allow_origins` list.

## Testing

1. Configure CORS in your API
2. Remove the local proxy (`pages/api/proxy-detect-food.js`)
3. Update `config/api.ts` to use the API directly
4. Test locally and in production

## Current Structure

- ✅ Local proxy works for development
- ⚠️ Configure CORS in API for production
- ⚠️ Update allowed URLs when deploying frontend

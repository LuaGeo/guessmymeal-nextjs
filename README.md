# GuessMyMeal Next.js

Food detection application using AI, built with Next.js and connected to an external API on Railway.

## Setup

### 1. Environment Variables

Create a `.env.local` file in the project root with the following configuration:

```bash
# External API URL on Railway
API_URL=https://your_api_url.railway.app
```

**Note:** API repository (FastAPI): [https://github.com/LuaGeo/guessmymeal-api](guessmymeal-api)

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the Project

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Features

- **Firebase Authentication**: Login/logout system
- **Image Upload**: Support for drag & drop and file selection
- **Food Detection**: Integration with external API for food detection
- **Modern Interface**: Responsive design with Tailwind CSS

## Project Structure

```
guessmymeal-nextjs/
├── components/          # React components
├── config/             # API configurations
├── pages/              # Next.js pages
├── styles/             # CSS styles
└── firebaseConfig.ts   # Firebase configuration
```

## External API

This project has been adapted to use an external API on Railway. The API has the following endpoint:

- `POST /predict` - Receives an image (field `file`) and returns detected foods

### API Response Format

```json
{
  "success": true,
  "detections": [
    {
      "class_name": "pizza",
      "confidence": 0.95,
      "bbox": [x1, y1, x2, y2]
    }
  ],
  "annotated_image": "base64_encoded_image",
  "total_detections": 1
}
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure the environment variable `NEXT_PUBLIC_API_URL`
3. Automatic deployment

### Other Platforms

Make sure to configure the environment variable `NEXT_PUBLIC_API_URL` with your Railway API URL.

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Static typing
- **Tailwind CSS** - CSS framework
- **Firebase** - Authentication
- **Lucide React** - Icons
- **Railway** - External backend API

// config/api.js
export const getApiUrl = (endpoint) => {
  // En développement, pointer vers Python backend
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:8000";

  return `${baseUrl}${endpoint}`;
};

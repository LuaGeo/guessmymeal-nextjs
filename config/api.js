// config/api.js
export const getApiUrl = (endpoint) => {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

  // If endpoint already includes /api/, don't add it again
  if (endpoint.startsWith("/api/")) {
    return `${baseUrl}${endpoint}`;
  }

  // For endpoints without /api/, assume it's an API route
  return `${baseUrl}/api${endpoint}`;
};

// Simpler alternative if you always use local routes:
// export const getApiUrl = (endpoint) => {
//   return endpoint; // Returns just the endpoint, e.g. "/api/detect-food"
// };

// pages/api/detect-food.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("=== PROXY DEBUG START ===");
    console.log("Request method:", req.method);
    console.log("Request headers:", {
      "content-type": req.headers["content-type"],
      "content-length": req.headers["content-length"],
      "user-agent": req.headers["user-agent"],
    });

    // Get request body as buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    console.log("Request buffer size:", buffer.length, "bytes");

    if (buffer.length === 0) {
      console.error("❌ Empty request body");
      return res.status(400).json({
        success: false,
        error: "Empty request body",
      });
    }

    // External API URL
    const apiUrl = process.env.API_URL;
    console.log("🚀 Calling external API:", apiUrl);

    // Headers for external request
    const externalHeaders = {
      "Content-Type": req.headers["content-type"] || "multipart/form-data",
      "Content-Length": buffer.length.toString(),
      Accept: "application/json",
      "User-Agent": "NextJS-Proxy/1.0",
    };

    console.log("External request headers:", externalHeaders);

    // Make request to external API
    const response = await fetch(apiUrl, {
      method: "POST",
      body: buffer,
      headers: externalHeaders,
    });

    console.log("📡 External API response status:", response.status);
    console.log("📡 External API response headers:", {
      "content-type": response.headers.get("content-type"),
      "content-length": response.headers.get("content-length"),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ External API Error:", response.status, errorText);

      return res.status(response.status).json({
        success: false,
        error: `External API Error: ${response.status}`,
        details: errorText,
      });
    }

    const result = await response.json();
    console.log("✅ External API success response:", {
      success: result.success,
      detections_count: result.detections?.length || 0,
      has_annotated_image: !!result.annotated_image,
      total_detections: result.total_detections,
    });

    // Ensure response has the format expected by frontend
    const formattedResult = {
      success: true,
      detections: result.detections || [],
      annotated_image: result.annotated_image || null,
      total_detections:
        result.total_detections || result.detections?.length || 0,
    };

    console.log("=== PROXY DEBUG END ===");
    return res.status(200).json(formattedResult);
  } catch (error) {
    console.error("💥 Proxy error:", error.message);
    console.error("Stack trace:", error.stack);

    return res.status(500).json({
      success: false,
      error: "Internal proxy error",
      details: error.message,
    });
  }
}

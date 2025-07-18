// pages/api/detect-food.js
import { IncomingForm } from "formidable";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({
    uploadDir: "/tmp",
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
  });

  try {
    const [, files] = await form.parse(req);
    const imageFile = files.image[0];

    if (!imageFile) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Call Python script for food detection
    const pythonScriptPath = path.join(
      process.cwd(),
      "scripts",
      "detect_food.py"
    );
    const modelPath = path.join(
      process.cwd(),
      "models",
      "food_detection_model.pt"
    );

    const pythonProcess = spawn("python", [
      pythonScriptPath,
      imageFile.filepath,
      modelPath,
    ]);

    let result = "";
    let error = "";

    console.log("Received file:", imageFile);
    console.log("Image path:", imageFile.filepath);
    console.log("Model path:", modelPath);

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      // Clean up uploaded file
      fs.unlinkSync(imageFile.filepath);

      if (code !== 0) {
        console.error("Python script error:", error);
        return res.status(500).json({
          success: false,
          error: "Detection failed",
        });
      }

      try {
        const lines = result.trim().split("\n");
        const lastLine = lines[lines.length - 1];
        const detectionResult = JSON.parse(lastLine);
        return res.status(200).json({
          success: true,
          ...detectionResult,
        });
      } catch (parseError) {
        console.error("Failed to parse Python output:", parseError);
        return res.status(500).json({
          success: false,
          error: "Failed to process detection results",
        });
      }
    });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

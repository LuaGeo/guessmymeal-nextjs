// pages/index.tsx;

import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  DragEvent,
} from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, sendEmailVerification } from "../firebaseConfig"; // Make sure to import sendEmailVerification
import AuthForm from "../components/AuthForm";
import { Upload, Camera, X, Loader2, AlertCircle } from "lucide-react";
import { getApiUrl } from "../config/api";

type DetectionResult = {
  class_name: string;
  confidence: number;
  nutrition?: {
    ["energy-kcal"]?: number;
    proteins?: number;
    fat?: number;
    carbohydrates?: number;
    [key: string]: number | undefined;
  };
};

// Your FoodDetectionApp component remains unchanged
const FoodDetectionApp = () => {
  // ... (all of your existing FoodDetectionApp code)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedImage, setDetectedImage] = useState<string | null>(null);
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          setSelectedImage(e.target?.result as string);
          setDetectedImage(null);
          setDetectionResults([]);
          setError(null);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setSelectedImage(e.target?.result as string);
        setDetectedImage(null);
        setDetectionResults([]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const detectFood = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const apiUrl = getApiUrl("/api/predict");
      console.log("Making request to:", apiUrl);
      console.log(
        "File:",
        selectedFile.name,
        selectedFile.type,
        selectedFile.size
      );

      for (const [key, value] of formData.entries()) {
        console.log("FormData entry:", key, value);
      }

      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", apiResponse.status);
      console.log("Response URL:", apiResponse.url);
      console.log(
        "Response headers:",
        Object.fromEntries(apiResponse.headers.entries())
      );

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error("API Error:", errorText);
        throw new Error(`Detection failed: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      console.log("API Result:", result);

      if (result.success) {
        setDetectedImage(result.annotated_image);
        setDetectionResults(result.detections || []);
      } else {
        setError(result.error || "Detection failed");
      }
    } catch (err) {
      console.error("Detection error:", err);
      setError("An error occurred during detection");
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setDetectedImage(null);
    setDetectionResults([]);
    setError(null);
  };

  useEffect(() => {
    console.log("API KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GuessMyMeal</h1>
              <p className="text-gray-600">Food detection with AI</p>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!selectedImage && (
          <div className="mb-8">
            <div
              className="border-2 border-dashed border-orange-300 rounded-xl p-12 text-center bg-white hover:bg-orange-50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="mx-auto h-16 w-16 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload an image
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop an image or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: JPG, JPEG, PNG
              </p>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        )}
        {selectedImage && (
          <div className="space-y-6">
            <div className="flex justify-center space-x-4">
              <button
                onClick={detectFood}
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Detection in progress...</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5" />
                    <span>Detect foods</span>
                  </>
                )}
              </button>
              <button
                onClick={resetApp}
                className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 flex items-center space-x-2 transition-all"
              >
                <X className="h-5 w-5" />
                <span>New image</span>
              </button>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Original Image
                  </h3>
                </div>
                <div className="p-6">
                  <img
                    src={selectedImage}
                    alt="Original"
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
              </div>
              {detectedImage && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Detection
                    </h3>
                  </div>
                  <div className="p-6">
                    <img
                      src={`data:image/jpeg;base64,${detectedImage}`}
                      alt="Detected"
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
            {detectionResults.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detection Results
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {detectionResults.map((result, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            {result.class_name}
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            {(result.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        {/* Barre de progression */}
                        <div className="mt-2">
                          <div className="bg-white rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-green-400 to-blue-400 h-full transition-all duration-300"
                              style={{ width: `${result.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                        {/* Bloc nutrition */}
                        {result.nutrition && (
                          <div className="mt-3 text-sm text-gray-700">
                            <p>
                              🍽️ <strong>Nutrition (pour 100g) :</strong>
                            </p>
                            <ul className="list-disc list-inside">
                              {result.nutrition?.["energy-kcal"] !==
                                undefined && (
                                <li>
                                  <strong>Calories :</strong>{" "}
                                  {result.nutrition?.["energy-kcal"]} kcal
                                </li>
                              )}
                              {result.nutrition.proteins !== undefined && (
                                <li>
                                  <strong>Protéines :</strong>{" "}
                                  {result.nutrition.proteins} g
                                </li>
                              )}
                              {result.nutrition.fat !== undefined && (
                                <li>
                                  <strong>Lipides :</strong>{" "}
                                  {result.nutrition.fat} g
                                </li>
                              )}
                              {result.nutrition.carbohydrates !== undefined && (
                                <li>
                                  <strong>Glucides :</strong>{" "}
                                  {result.nutrition.carbohydrates} g
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {detectionResults.length === 0 && detectedImage && (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No food detected
                </h3>
                <p className="text-gray-600">
                  Try with another image or make sure the image contains
                  recognizable foods.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Show a loading state while we check the user's status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  // If no user is logged in, show the login/signup form
  if (!user) {
    return <AuthForm />;
  }

  // If a user is logged in, but their email is NOT verified, show a message
  if (user && !user.emailVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-orange-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Please verify your email
          </h2>
          <p className="text-gray-600 mb-6">
            A verification link has been sent to **{user.email}**. Click the
            link in your inbox to activate your account.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => signOut(auth)}
              className="w-full sm:w-auto bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If a user is logged in AND their email is verified, show the full app
  return (
    <div>
      <div className="flex justify-end items-center gap-4 p-4">
        <span className="text-gray-800 font-medium">Welcome, {user.email}</span>
        <button
          onClick={() => signOut(auth)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-5 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
        >
          Logout
        </button>
      </div>
      <FoodDetectionApp />
    </div>
  );
}

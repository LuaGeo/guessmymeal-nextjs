import React, { useState, useCallback, ChangeEvent, DragEvent } from "react";
import { Upload, Camera, X, Loader2, AlertCircle } from "lucide-react";

type DetectionResult = {
  class_name: string;
  confidence: number;
};

const FoodDetectionApp = () => {
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
      formData.append("image", selectedFile);
      const apiResponse = await fetch("/api/detect-food", {
        method: "POST",
        body: formData,
      });
      if (!apiResponse.ok) {
        throw new Error("Detection failed");
      }
      const result = await apiResponse.json();
      if (result.success) {
        setDetectedImage(result.annotated_image);
        setDetectionResults(result.detections || []);
      } else {
        setError(result.error || "Detection failed");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la détection");
      console.error(err);
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
              <p className="text-gray-600">Détection d'aliments avec IA</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
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
                Téléchargez une image
              </h3>
              <p className="text-gray-600 mb-4">
                Glissez-déposez une image ou cliquez pour sélectionner
              </p>
              <p className="text-sm text-gray-500">
                Formats supportés: JPG, JPEG, PNG
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

        {/* Image Display and Results */}
        {selectedImage && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={detectFood}
                disabled={isLoading}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Détection en cours...</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5" />
                    <span>Détecter les aliments</span>
                  </>
                )}
              </button>
              <button
                onClick={resetApp}
                className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 flex items-center space-x-2 transition-all"
              >
                <X className="h-5 w-5" />
                <span>Nouvelle image</span>
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Images Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Image Originale
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

              {/* Detected Image */}
              {detectedImage && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Détection
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

            {/* Detection Results */}
            {detectionResults.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Résultats de la détection
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
                        <div className="mt-2">
                          <div className="bg-white rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-green-400 to-blue-400 h-full transition-all duration-300"
                              style={{ width: `${result.confidence * 100}%` }}
                            />
                          </div>
                        </div>
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
                  Aucun aliment détecté
                </h3>
                <p className="text-gray-600">
                  Essayez avec une autre image ou assurez-vous que l'image
                  contient des aliments reconnaissables.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default FoodDetectionApp;

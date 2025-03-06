"use client";

import { useState } from "react";

interface FeatureBreakdown {
  component: string;
  description: string;
}

interface AnalysisResult {
  message: string;
  functionalRequirement: string[];
  nonFunctionalRequirement: string[];
  featureBreakdown: FeatureBreakdown[];
}

interface AnalysisResponse {
  message: string;
  data: {
    requirementText: string;
    requirementFileUrl: string;
    functionalRequirement: any[];
    nonFunctionalRequirement: any[];
    _id: string;
  };
}

export default function RequirementAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [requirementText, setRequirementText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string>("");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(
    null
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccess("");
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError("Please upload only PDF or Word documents");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequirementText(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select a file to proceed");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("requirementText", requirementText);
    formData.append("projectId", "67c953ecd0342501668135e5");

    try {
      const response = await fetch(
        "http://localhost:8080/requirment-analysis",
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      console.log("Response status:", response.status);
      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: AnalysisResponse = await response.json();
      setSuccess(result.message);
      setSelectedFile(null);
      setRequirementText("");
      // Reset file input
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Error details:", err);
      setError(
        err instanceof Error ? err.message : "Error processing requirements"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetResults = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/requirment-analysis/67c9c3c045c5ed5903c5787a",
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      console.log("Response status:", response.status);
      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResults(result);
    } catch (err) {
      console.error("Error fetching results:", err);
      setError(
        err instanceof Error ? err.message : "Error fetching analysis results"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderAnalysisResults = () => {
    if (!analysisResults) return null;

    return (
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>

        {/* Functional Requirements */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Functional Requirements
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            {analysisResults.functionalRequirement.map((req, index) => (
              <li key={index} className="text-gray-600">
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Non-Functional Requirements */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            Non-Functional Requirements
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            {analysisResults.nonFunctionalRequirement.map((req, index) => (
              <li key={index} className="text-gray-600">
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Feature Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Feature Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisResults.featureBreakdown.map((feature, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-medium text-gray-800 mb-2">
                  {feature.component}
                </h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Input Requirements</h2>

      <div
        className={`border-2 border-dashed p-6 text-center rounded-2xl ${
          error ? "border-red-500 bg-red-50" : ""
        }`}
        style={{
          borderColor: error ? "#EF4444" : "#FF5B27",
          backgroundColor: error
            ? "rgba(239, 68, 68, 0.1)"
            : "rgba(255, 91, 39, 0.1)",
        }}
      >
        <input
          type="file"
          className="hidden"
          id="file-upload"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer px-4 py-2 rounded"
          style={{
            backgroundColor: "#FF5B27",
            color: "white",
          }}
        >
          Browse Files
        </label>
        <p className="mt-2 text-gray-600">
          Drag and drop PDF or Word documents here
        </p>
        {selectedFile && (
          <p className="mt-2 text-gray-800 font-medium">
            Selected File: {selectedFile.name}
          </p>
        )}
      </div>

      <div className="mt-4">
        <p className="text-gray-600 mb-2">
          Optional: Add additional requirements
        </p>
        <textarea
          value={requirementText}
          onChange={handleTextChange}
          placeholder="Paste additional requirements text here... (optional)"
          className="w-full p-2 border rounded min-h-[100px] rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedFile || isLoading}
        className={`mt-4 px-4 py-2 rounded text-white transition-colors duration-200 flex items-center justify-center ${
          selectedFile && !isLoading
            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          "Process Requirements"
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-green-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-600">{success}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleGetResults}
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 flex items-center justify-center cursor-pointer"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Fetching Results...
          </>
        ) : (
          "Get Analysis Results"
        )}
      </button>

      {/* Render analysis results */}
      {renderAnalysisResults()}
    </div>
  );
}

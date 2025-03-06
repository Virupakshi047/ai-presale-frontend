"use client";

import { useState } from "react";

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
    </div>
  );
}

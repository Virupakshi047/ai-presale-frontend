"use client";

import { useState } from "react";

export default function RequirementAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [requirementText, setRequirementText] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
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

  const handleSubmit = () => {
    if (!selectedFile) {
      setError("Please select a file to proceed");
      return;
    }

    // Proceed with processing
    console.log("Processing file:", selectedFile);
    if (requirementText) {
      console.log("Additional text:", requirementText);
    }
    // Add your API call here
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
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
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
        className={`mt-4 px-4 py-2 rounded text-white transition-colors duration-200 ${
          selectedFile
            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            : "bg-gray-400 cursor-not-allowed "
        }`}
        disabled={!selectedFile}
      >
        Process Requirements
      </button>

      {/* ...existing analysis results section... */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Analysis Results</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium">Functional Requirements</h4>
          </div>
          <div>
            <h4 className="font-medium">Non-Functional Requirements</h4>
          </div>
          <div>
            <h4 className="font-medium">Feature Breakdown</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

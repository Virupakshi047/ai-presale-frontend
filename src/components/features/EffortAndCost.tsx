"use client";

import { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";

interface EstimationResponse {
  message: string;
  effortEstimationUrl: string;
}

export default function EffortAndCost() {
  const { currentProject } = useProject();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!currentProject?._id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch the estimation URL
      const response = await fetch(
        `http://localhost:8080/estimation/${currentProject._id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch estimation file");
      }

      const data: EstimationResponse = await response.json();

      // Create a temporary link to download the file
      const link = document.createElement("a");
      link.href = data.effortEstimationUrl;
      link.target = "_blank";
      link.download = `effort_estimation_${currentProject._id}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download file");
      console.error("Error downloading estimation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Effort and Cost Estimation
          </h2>
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200
              ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <FileSpreadsheet className="w-5 h-5" />
                <Download className="w-5 h-5" />
              </>
            )}
            <span>{isLoading ? "Downloading..." : "Download Estimation"}</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg mt-4">
            {error}
          </div>
        )}

        <div className="text-gray-600">
          <p>
            Download the detailed effort and cost estimation for your project.
            The Excel file includes:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Feature-wise effort breakdown</li>
            <li>Resource allocation details</li>
            <li>Timeline estimates</li>
            <li>Cost calculations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

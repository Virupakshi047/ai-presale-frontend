"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import RequirementAnalyzer from "../features/RequirementAnalyzer";
import AITechStack from "../features/TechStack";
import { useProject } from "@/context/ProjectContext";
import AIBusinessAnalyst from "../features/AIBusinessAnalyst";
import EffortAndCost from "@/components/features/EffortAndCost";
import { History, ChevronDown } from "lucide-react";

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

export default function MainBody() {
  const [activeTab, setActiveTab] = useState("requirementAnalysis");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(
    null
  );
  const [showVersions, setShowVersions] = useState(false);
  const pathname = usePathname();
  const { currentProject, projects, setCurrentProject } = useProject();

  useEffect(() => {
    // Update current project based on URL and handle initial load
    if (projects.length > 0) {
      if (pathname === "/dashboard") {
        // Set first project as default if on dashboard
        setCurrentProject(projects[0]);
      } else {
        const projectName = decodeURIComponent(pathname.split("/").pop() || "");
        const project = projects.find((p) => p.name === projectName);
        if (project) {
          setCurrentProject(project);
        } else {
          // Fallback to first project if none matches the URL
          setCurrentProject(projects[0]);
        }
      }
    }
  }, [pathname, projects, setCurrentProject]);

  const tabs = [
    { id: "requirementAnalysis", label: "Requirement Analysis" },
    { id: "feature1", label: "Tech-stack" },
    { id: "feature2", label: "Business Analyst" },
    { id: "feature3", label: "Effort and Cost estimation" },
    { id: "feature4", label: "Wireframe & UI" },
  ];
  const handleAnalysisResults = (results: AnalysisResult) => {
    setAnalysisResults(results);
  };

  // Add loading state for better UX
  if (projects.length > 0 && !currentProject) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">
            {currentProject?.name || "Select a Project"}
          </h1>

          {currentProject && (
            <div className="relative">
              <button
                onClick={() => setShowVersions(!showVersions)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              >
                <History size={16} className="text-gray-500" />
                <span>Version 1.0.0</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-200 ${
                    showVersions ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showVersions && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="max-h-64 overflow-y-auto">
                    {[1, 2, 3].map((version) => (
                      <button
                        key={version}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex flex-col cursor-pointer">
                          <span className="font-medium">
                            Version {version}.0.0
                          </span>
                          <span className="text-xs text-gray-500">
                            March 18, 2024 12:00 PM
                          </span>
                        </div>
                        {version === 1 && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            Current
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {currentProject && (
          <span className="text-sm text-gray-500">
            Project ID: {currentProject._id}
          </span>
        )}
      </div>

      <div className="mb-4 border-b">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 cursor-pointer ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === "requirementAnalysis" && <RequirementAnalyzer />}
        {activeTab === "feature1" && <AITechStack />}
        {activeTab === "feature2" && <AIBusinessAnalyst />}
        {activeTab === "feature3" && <EffortAndCost />}
        {activeTab === "feature4" && <div>Wireframe & UI </div>}
      </div>
    </div>
  );
}

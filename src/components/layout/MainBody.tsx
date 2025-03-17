"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import RequirementAnalyzer from "../features/RequirementAnalyzer";
import AITechStack from "../features/TechStack";
import { useProject } from "@/context/ProjectContext";
import AIBusinessAnalyst from "../features/AIBusinessAnalyst";
import EffortAndCost from "@/components/features/EffortAndCost";

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
        <h1 className="text-3xl font-bold">
          {currentProject?.name || "Select a Project"}
        </h1>
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
        {activeTab === "feature4" && <div>Wireframe & UI  </div>}
      </div>
    </div>
  );
}

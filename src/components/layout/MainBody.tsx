"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import RequirementAnalyzer from "../features/RequirementAnalyzer";
import AITechStack from "../features/TechStack";
import { useProject } from "@/context/ProjectContext";
import AIBusinessAnalyst from "../features/AIBusinessAnalyst";
import EffortAndCost from "@/components/features/EffortAndCost";
import { History, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import WireframeCanvas from "@/components/features/WireframeCanvas";
import AssignProject from "../features/AssignProject";
import { Toaster } from "react-hot-toast";

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
  const router = useRouter();
  const { currentProject, projects, setCurrentProject } = useProject();

  useEffect(() => {
    // Only run if we have projects and pathname
    if (projects.length > 0 && pathname) {
      if (pathname === "/dashboard") {
        setCurrentProject(projects[0]);
      } else {
        const projectName = decodeURIComponent(pathname.split("/").pop() || "");
        const project = projects.find((p) => p.name === projectName);
        if (project) {
          setCurrentProject(project);
        } else {
          // Only fallback to first project if no matching project is found
          router.push("/dashboard");
        }
      }
    }
  }, [pathname, projects, setCurrentProject, router]);

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
    <div className="p-6 pt-20 lg:pt-6">
      {" "}
      {/* Added top padding for mobile */}
      {/* Project Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
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
              {/* ... existing versions dropdown ... */}
            </div>
          )}
        </div>

        {currentProject && <AssignProject />}
      </div>
      {/* Project ID */}
      {currentProject && (
        <span className="text-sm text-gray-500 block mb-4">
          Project ID: {currentProject._id}
        </span>
      )}
      {/* Tabs Navigation with Scroll Buttons */}
      <div className="relative mb-4 border-b">
        <div className="flex items-center">
          <button
            onClick={() => {
              const tabsContainer = document.getElementById("tabs-container");
              if (tabsContainer) tabsContainer.scrollLeft -= 200;
            }}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            id="tabs-container"
            className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const tabsContainer = document.getElementById("tabs-container");
              if (tabsContainer) tabsContainer.scrollLeft += 200;
            }}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      {/* Content Area */}
      <div className="mt-6">
        {activeTab === "requirementAnalysis" && <RequirementAnalyzer />}
        {activeTab === "feature1" && <AITechStack />}
        {activeTab === "feature2" && <AIBusinessAnalyst />}
        {activeTab === "feature3" && <EffortAndCost />}
        {activeTab === "feature4" && <WireframeCanvas />}
      </div>
    </div>
  );
}

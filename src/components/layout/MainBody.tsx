"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import RequirementAnalyzer from "../features/RequirementAnalyzer";
import AITechStack from "../features/TechStack";
import { useProject } from "@/context/ProjectContext";
import AIBusinessAnalyst from "../features/AIBusinessAnalyst";
import EffortAndCost from "@/components/features/EffortAndCost";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WireframeCanvas from "@/components/features/WireframeCanvas";
import AssignProject from "../features/AssignProject";
// import { Toaster } from "react-hot-toast";

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

interface UserData {
  name: string;
  email: string;
  role: string;
}

export default function MainBody() {
  const [activeTab, setActiveTab] = useState("requirementAnalysis");
  const [userData, setUserData] = useState<UserData | null>(null);
  // const [showVersions, setShowVersions] = useState(false);
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

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      setUserData(parsedUserData);
    }
  }, []);

  const tabs = [
    { id: "requirementAnalysis", label: "Requirement Analysis" },
    { id: "feature1", label: "Tech-stack" },
    { id: "feature2", label: "Business Analyst" },
    ...(userData?.role !== "junior"
      ? [{ id: "feature3", label: "Effort and Cost estimation" }]
      : []),
    { id: "feature4", label: "Wireframe & UI" },
  ];

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
        <h1 className="text-3xl font-bold">
          {currentProject?.name || "Select a Project"}
        </h1>
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
        {activeTab === "feature3" && userData?.role !== "junior" && (
          <EffortAndCost />
        )}
        {activeTab === "feature4" && <WireframeCanvas />}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import RequirementAnalyzer from "../features/RequirementAnalyzer";
import AITechStack from "../features/TechStack";

export default function MainBody() {
  const [activeTab, setActiveTab] = useState("requirementAnalysis");
  const pathname = usePathname();

  // Extract project name from URL or use default
  let projectName = "Project 1";

  if (pathname !== "/dashboard") {
    const projectFromPath = decodeURIComponent(pathname.split("/").pop() || "");
    if (projectFromPath && projectFromPath !== "dashboard") {
      projectName = projectFromPath;
    }
  }

  const tabs = [
    { id: "requirementAnalysis", label: "Requirement Analysis" },
    { id: "feature1", label: "AI Tech-stack" },
    { id: "feature2", label: "Feature 2" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{projectName}</h1>

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
        {activeTab === "feature1" && <AITechStack projectId={projectName} />}
        {activeTab === "feature2" && (
          <div>Feature 2 Content for {projectName}</div>
        )}
      </div>
    </div>
  );
}

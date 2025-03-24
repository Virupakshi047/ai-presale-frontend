"use client";

import { useState, useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import { PencilIcon, XIcon } from "lucide-react";

interface SubFeature {
  name: string;
  description: string;
}

interface TechStackPreference {
  frontend: string[];
  backend: string[];
  database: string[];
}

interface Feature {
  name: string;
  description: string;
  subfeatures?: SubFeature[];
}

interface Module {
  module: string;
  features?: Feature[]; // Make features optional
}

interface AnalysisResult {
  message: string;
  functionalRequirement: string[];
  nonFunctionalRequirement: string[];
  featureBreakdown: Module[];
}

interface AnalysisResponse {
  message: string;
  data: AnalysisResult;
}

interface LoggedUserData {
  name: string;
  email: string;
  role: string;
}

interface TechStackOptions {
  frontend: string[];
  backend: string[];
  database: string[];
}

const webTechStacks: TechStackOptions = {
  frontend: [
    "React.js",
    "Next.js",
    "Angular",
    "Vue.js",
    "Svelte",
    "TypeScript",
  ],
  backend: [
    "Node.js",
    "Python/Django",
    "Java/Spring",
    ".NET Core",
    "PHP/Laravel",
    "Ruby on Rails",
  ],
  database: [
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "Redis",
    "Oracle",
    "Microsoft SQL",
  ],
};

const mobileTechStacks: TechStackOptions = {
  frontend: [
    "React Native",
    "Flutter",
    "Kotlin",
    "Swift",
    "Ionic",
    "Native Android",
    "Native iOS",
  ],
  backend: [
    "Firebase",
    "Node.js",
    "Python/Flask",
    "Java/Spring Boot",
    "GraphQL",
    ".NET Core",
  ],
  database: [
    "SQLite",
    "Realm",
    "Firebase Realtime DB",
    "MongoDB Mobile",
    "PostgreSQL",
    "MySQL",
  ],
};

export default function RequirementAnalyzer() {
  const { currentProject } = useProject();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [requirementText, setRequirementText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string>("");
  const [showInputSection, setShowInputSection] = useState(true);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(
    null
  );
  const [activeFeature, setActiveFeature] = useState<{
    moduleIndex: number | null;
    featureIndex: number | null;
    subfeatureIndex?: number | null;
    description: string;
  }>({
    moduleIndex: null,
    featureIndex: null,
    subfeatureIndex: null,
    description: "",
  });
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [platforms, setPlatforms] = useState({
    web: false,
    mobile: false,
  });

  const [techStack, setTechStack] = useState<TechStackPreference>({
    frontend: [],
    backend: [],
    database: [],
  });

  const [customTechStack, setCustomTechStack] = useState<{
    frontend: string;
    backend: string;
    database: string;
  }>({
    frontend: "",
    backend: "",
    database: "",
  });
  const [showCustomInput, setShowCustomInput] = useState<{
    frontend: boolean;
    backend: boolean;
    database: boolean;
  }>({
    frontend: false,
    backend: false,
    database: false,
  });
  const [loggedUser, setLoggedUser] = useState<LoggedUserData | null>(null);

  useEffect(() => {
    const controller = new AbortController(); // For cleanup

    async function loadAnalysis() {
      if (!currentProject?._id) {
        setShowInputSection(true);
        setAnalysisResults(null);
        return;
      }

      setIsAnalysisLoading(true);
      console.log("Loading analysis for project:", currentProject._id);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/requirment-analysis/${currentProject._id}`,
          {
            credentials: "include",
            headers: { Accept: "application/json" },
            signal: controller.signal,
          }
        );

        const result = await response.json();

        // Debug log
        console.log("Analysis result:", {
          projectId: currentProject._id,
          hasData: Boolean(result?.functionalRequirement?.length),
          result,
        });

        if (response.ok && result?.functionalRequirement?.length > 0) {
          setAnalysisResults(result);
          setShowInputSection(false);
        } else {
          setAnalysisResults(null);
          setShowInputSection(true);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Error loading analysis:", err);
          setAnalysisResults(null);
          setShowInputSection(true);
        }
      } finally {
        setIsAnalysisLoading(false);
      }
    }

    // Reset states first
    setSelectedFile(null);
    setRequirementText("");
    setError("");
    setSuccess("");
    setActiveFeature({
      moduleIndex: null,
      featureIndex: null,
      subfeatureIndex: null,
      description: "",
    });

    loadAnalysis();

    // Cleanup function
    return () => controller.abort();
  }, [currentProject?._id]); // Only depend on the ID

  useEffect(() => {
    const userData = getLoggedUserData();
    setLoggedUser(userData);
  }, []);

  const getLoggedUserData = (): LoggedUserData | null => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  };

  const hasEditAccess =
    loggedUser?.role === "head" || loggedUser?.role === "associate";

  const handlePlatformChange = (platform: "web" | "mobile") => {
    setPlatforms((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const handleTechStackChange = (
    category: keyof TechStackPreference,
    value: string
  ) => {
    if (value === "Other") {
      setShowCustomInput((prev) => ({
        ...prev,
        [category]: !prev[category],
      }));
      return;
    }

    setTechStack((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((tech) => tech !== value)
        : [...prev[category], value],
    }));
  };

  const handleCustomTechStackChange = (
    category: keyof TechStackPreference,
    value: string
  ) => {
    setCustomTechStack((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

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

    if (!currentProject) {
      setError("Please select a project first");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    const techStackWithCustom = {
      frontend: [
        ...techStack.frontend,
        ...(customTechStack.frontend ? [customTechStack.frontend] : []),
      ],
      backend: [
        ...techStack.backend,
        ...(customTechStack.backend ? [customTechStack.backend] : []),
      ],
      database: [
        ...techStack.database,
        ...(customTechStack.database ? [customTechStack.database] : []),
      ],
    };

    const projectId = currentProject._id; // Capture the project ID at the start
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("requirementText", requirementText);
    formData.append("projectId", projectId);
    formData.append("platforms", JSON.stringify(platforms));
    formData.append("techStack", JSON.stringify(techStackWithCustom));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/requirment-analysis/${currentProject._id}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Please Upload a file");
      }

      const result: AnalysisResponse = await response.json();
      setSuccess(result.message);
      setSelectedFile(null);
      setRequirementText("");

      // Automatically fetch and show results
      const analysisResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/requirment-analysis/${projectId}`,
        {
          credentials: "include",
          headers: { Accept: "application/json" },
        }
      );

      if (analysisResponse.ok) {
        const analysisResult: AnalysisResult = await analysisResponse.json();

        // Validate the response structure
        if (
          analysisResult &&
          Array.isArray(analysisResult.functionalRequirement) &&
          Array.isArray(analysisResult.nonFunctionalRequirement) &&
          Array.isArray(analysisResult.featureBreakdown)
        ) {
          if (currentProject._id === projectId) {
            setAnalysisResults(analysisResult);
            setShowInputSection(false);
          }
        } else {
          throw new Error("Invalid analysis result structure");
        }
      }

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

  const renderModifyButtons = () => (
    <>
      {hasEditAccess && (
        <div className="fixed bottom-6 right-6 flex gap-2">
          {showInputSection ? (
            <button
              onClick={() => {
                setShowInputSection(false);
                // Reset input states
                setSelectedFile(null);
                setRequirementText("");
                setError("");
                setSuccess("");
              }}
              className="p-3 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-200"
              title="Cancel modification"
            >
              <XIcon className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setShowInputSection(true)}
              className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
              title="Modify requirements"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </>
  );

  const renderAnalysisResults = () => {
    if (!analysisResults) return null;

    return (
      <div className="space-y-6">
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
          <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
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
          <div className="space-y-8">
            {analysisResults?.featureBreakdown?.map((module, moduleIndex) => (
              <div key={moduleIndex}>
                <h4 className="text-lg font-bold text-gray-800 mb-4">
                  {module.module}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {/* Add null check for features array */}
                  {module.features?.map((feature, featureIndex) => {
                    const isActive =
                      activeFeature.moduleIndex === moduleIndex &&
                      activeFeature.featureIndex === featureIndex;

                    return (
                      <div key={featureIndex} className="relative">
                        <div
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-all duration-200 cursor-pointer bg-white"
                          onClick={() =>
                            setActiveFeature((prev) =>
                              isActive
                                ? {
                                    moduleIndex: null,
                                    featureIndex: null,
                                    description: "",
                                  }
                                : {
                                    moduleIndex,
                                    featureIndex,
                                    description: feature.description,
                                  }
                            )
                          }
                        >
                          <h4 className="font-medium text-gray-800 text-center flex justify-between items-center">
                            {feature.name}
                            {feature.subfeatures &&
                              feature.subfeatures.length > 0 && (
                                <span className="text-gray-500 text-sm">
                                  {isActive ? "▲" : "▼"}
                                </span>
                              )}
                          </h4>
                          {isActive && (
                            <div className="lg:hidden mt-2 p-2 text-sm text-gray-600 border-t border-gray-200">
                              {feature.description}
                            </div>
                          )}
                        </div>
                        {isActive &&
                          feature.subfeatures &&
                          feature.subfeatures.length > 0 && (
                            <ul className="mt-2 space-y-2 bg-gray-50 p-3 rounded-lg">
                              {feature.subfeatures.map(
                                (subfeature, subIndex) => (
                                  <li
                                    key={subIndex}
                                    className="text-sm text-gray-700 pl-4 border-l-2 border-gray-300"
                                  >
                                    <span className="font-semibold">
                                      {subfeature.name}:
                                    </span>{" "}
                                    {subfeature.description}
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                      </div>
                    );
                  }) || (
                    <div className="text-gray-500 italic">
                      No features available for this module
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getAvailableTechStacks = (
    category: keyof TechStackOptions
  ): string[] => {
    const techStacks = new Set<string>();

    if (platforms.web) {
      webTechStacks[category].forEach((tech) => techStacks.add(tech));
    }
    if (platforms.mobile) {
      mobileTechStacks[category].forEach((tech) => techStacks.add(tech));
    }

    // If no platform selected, show web tech stacks as default
    if (!platforms.web && !platforms.mobile) {
      webTechStacks[category].forEach((tech) => techStacks.add(tech));
    }

    return Array.from(techStacks);
  };

  const renderTechStackSection = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        Tech Stack Preferences
      </h3>

      <div className="space-y-6">
        {[
          { category: "frontend", label: "Frontend" },
          { category: "backend", label: "Backend" },
          { category: "database", label: "Database" },
        ].map(({ category, label }) => (
          <div key={category} className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <div className="flex flex-wrap gap-2">
              {[
                ...getAvailableTechStacks(category as keyof TechStackOptions),
                "Other",
              ].map((tech) => (
                <label
                  key={tech}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full border transition-colors ${
                    tech === "Other"
                      ? showCustomInput[
                          category as keyof typeof showCustomInput
                        ]
                        ? "bg-blue-100 border-blue-300"
                        : "border-gray-300 hover:border-blue-300"
                      : techStack[
                          category as keyof TechStackPreference
                        ].includes(tech)
                      ? "bg-blue-100 border-blue-300"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={
                      tech === "Other"
                        ? showCustomInput[
                            category as keyof typeof showCustomInput
                          ]
                        : techStack[
                            category as keyof TechStackPreference
                          ].includes(tech)
                    }
                    onChange={() =>
                      handleTechStackChange(
                        category as keyof TechStackPreference,
                        tech
                      )
                    }
                    className="sr-only"
                  />
                  <span className="text-sm text-gray-700">{tech}</span>
                </label>
              ))}
            </div>
            {showCustomInput[category as keyof typeof showCustomInput] && (
              <input
                type="text"
                value={
                  customTechStack[category as keyof typeof customTechStack]
                }
                onChange={(e) =>
                  handleCustomTechStackChange(
                    category as keyof TechStackPreference,
                    e.target.value
                  )
                }
                placeholder={`Enter custom ${label.toLowerCase()} technology`}
                className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {!currentProject ? (
        <div className="text-center text-gray-600">
          Please select a project to proceed
        </div>
      ) : isAnalysisLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : showInputSection && hasEditAccess ? (
        <>
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
          {/* Platform Selection with improved UI */}
          <div className="mt-8 mb-6 bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Platform Selection
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              {[
                { id: "web", label: "Web Application", icon: "🌐" },
                { id: "mobile", label: "Mobile Application", icon: "📱" },
              ].map((platform) => (
                <label
                  key={platform.id}
                  className={`flex-1 flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    platforms[platform.id as keyof typeof platforms]
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={platforms[platform.id as keyof typeof platforms]}
                    onChange={() =>
                      handlePlatformChange((platform.id as "web") || "mobile")
                    }
                    className="sr-only"
                  />
                  <span className="mr-3 text-xl">{platform.icon}</span>
                  <span className="font-medium text-gray-700">
                    {platform.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tech Stack Selection with improved UI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 ">
            {/* Text Area - Left Column */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-2 font-medium">
                Additional Requirements
              </p>
              <textarea
                value={requirementText}
                onChange={handleTextChange}
                placeholder="Paste additional requirements text here... (optional)"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px] resize-none"
              />
            </div>

            {/* Tech Stack Preferences - Right Column */}
            {renderTechStackSection()}
          </div>
          {/* Process Button */}
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
        </>
      ) : (
        <>{renderAnalysisResults()}</>
      )}
      {currentProject && renderModifyButtons()}{" "}
      {/* Always show modify/cancel buttons when project exists */}
    </div>
  );
}

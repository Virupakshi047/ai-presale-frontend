"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/context/ProjectContext";
import MermaidDiagram from "../ui/MermaidDiagram";
import { convertJsonToMermaid } from "@/utils/mermaidConverter";

interface Technology {
  name: string;
  description: string;
}

interface ArchitectureResponse {
  message: string;
  diagram: {
    nodes: Array<{
      id: string;
      attributes: {
        type?: string;
        technology?: string;
        components?: string[];
      };
    }>;
    edges: Array<{
      source: string;
      target: string;
      attributes: {
        protocol: string;
      };
    }>;
  };
}

interface TechStackData {
  frontend: Technology[];
  backend: Technology[];
  database: Technology[];
  API_integrations: Technology[];
  others: Technology[];
}

interface TechStackResponse {
  message: string;
  techStack: {
    _id: string;
    frontend: Technology[];
    backend: Technology[];
    database: Technology[];
    API_integrations: Technology[];
    others: Technology[];
    createdAt: string;
    __v: number;
  };
}

const AITechStack: React.FC = () => {
  const router = useRouter();
  const { currentProject } = useProject();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<{
    techStack: TechStackData | null;
    architecture: ArchitectureResponse | null;
  }>({
    techStack: null,
    architecture: null,
  });

  useEffect(() => {
    console.log("Fetching data..."); // Debug log
    let isMounted = true; // For cleanup

    const fetchData = async () => {
      if (!currentProject?._id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [techStackResponse, architectureResponse] = await Promise.all([
          fetch(
            `http://localhost:8080/tech-architecture/generate-tech-stack/${currentProject._id}`,
            {
              credentials: "include",
              headers: {
                Accept: "application/json",
              },
            }
          ),
          fetch(
            `http://localhost:8080/tech-architecture/generate-architecture-diagram/${currentProject._id}`,
            {
              credentials: "include",
              headers: {
                Accept: "application/json",
              },
            }
          ),
        ]);

        if (!techStackResponse.ok || !architectureResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [techStackData, architectureData] = await Promise.all([
          techStackResponse.json(),
          architectureResponse.json(),
        ]);

        if (isMounted) {
          // Single state update instead of multiple
          setData({
            techStack: techStackData.techStack,
            architecture: architectureData,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : "Error fetching data"
          );
          setData({ techStack: null, architecture: null });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup
    };
  }, [currentProject?._id]);

  const mermaidDiagram = data.architecture
    ? convertJsonToMermaid(data.architecture)
    : "";

  const categories = [
    { id: 1, key: "frontend", title: "Frontend" },
    { id: 2, key: "backend", title: "Backend" },
    { id: 3, key: "database", title: "Database" },
    { id: 4, key: "API_integrations", title: "API Integrations" },
    { id: 5, key: "others", title: "Others" },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading tech stack recommendations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            Error Loading Tech Stack
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
        </div>
      </div>
    );
  }

  const isTechStackEmpty =
    !data.techStack ||
    Object.values(data.techStack).every((arr) => arr.length === 0);

  if (isTechStackEmpty) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Requirements Analysis Required
          </h2>
          <p className="text-gray-600 mb-8">
            Please complete the requirements analysis first to generate the tech
            stack recommendations.
          </p>
          <button
            onClick={() => router.push("/requirements")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go to Requirements Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Recommended Tech Stack
      </h2>

      <div className="bg-white rounded-lg shadow-md p-6 mb-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          System Architecture
        </h3>
        <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden">
          <MermaidDiagram
            chart={mermaidDiagram || "graph LR\nA[Loading...]"}
            className="flex items-center justify-center"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-700 pb-2 mb-4 border-b-2 border-gray-100">
              {category.title}
            </h3>
            <div className="space-y-4">
              {data.techStack?.[category.key as keyof TechStackData]?.map(
                (tech, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {/* You can add tech icons here using a library like react-icons */}
                      <span className="font-medium text-gray-800">
                        {tech.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{tech.description}</p>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AITechStack;

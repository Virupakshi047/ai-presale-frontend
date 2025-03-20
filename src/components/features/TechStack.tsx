"uuse client";
import React, { useEffect, useState, useMemo } from "react";
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
  architectureDiagram: {
    diagramData: {
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
    console.log("[TechStack] Starting data fetch");
    let isMounted = true;

    const fetchData = async () => {
      if (!currentProject?._id) {
        console.log("[TechStack] No current project ID");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log("[TechStack] Fetching architecture data");
        const architectureResponse = await fetch(
          `http://localhost:8080/tech-architecture/generate-architecture-diagram/${currentProject._id}`,
          {
            credentials: "include",
            headers: { Accept: "application/json" },
          }
        );

        if (!architectureResponse.ok) {
          throw new Error(
            `Architecture fetch failed: ${architectureResponse.status}`
          );
        }

        const architectureData = await architectureResponse.json();
        console.log("[TechStack] Architecture data received:", {
          hasData: !!architectureData,
          messageType: typeof architectureData.message,
        });

        if (isMounted) {
          // Convert the diagram data
          const mermaidCode = convertJsonToMermaid({
            diagram: architectureData.architectureDiagram.diagramData,
          });
          console.log("[TechStack] Converted to Mermaid:", {
            codeLength: mermaidCode.length,
            firstLine: mermaidCode.split("\n")[0],
          });

          setData((prev) => ({
            ...prev,
            architecture: architectureData,
          }));
        }
      } catch (error) {
        console.error("[TechStack] Error:", error);
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : "Error fetching data"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [currentProject?._id]);

  useEffect(() => {
    console.log("[TechStack] Architecture data:", data.architecture);
  }, [data.architecture]); // Debug log to check what data we have

  useEffect(() => {
    const fetchTechStack = async () => {
      if (!currentProject?._id) return;

      try {
        const response = await fetch(
          `http://localhost:8080/tech-architecture/generate-tech-stack/${currentProject._id}`,
          {
            credentials: "include",
            headers: { Accept: "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tech stack");
        }

        const techStackData = await response.json();
        setData((prev) => ({
          ...prev,
          techStack: techStackData.techStack,
        }));
      } catch (error) {
        console.error("[TechStack] Tech stack fetch error:", error);
      }
    };

    fetchTechStack();
  }, [currentProject?._id]);

  const mermaidDiagram = useMemo(() => {
    if (!data.architecture?.architectureDiagram?.diagramData) {
      console.log("[TechStack] No diagram data available");
      return "";
    }

    try {
      const diagram = convertJsonToMermaid({
        diagram: data.architecture.architectureDiagram.diagramData,
      });
      console.log("[TechStack] Generated diagram code:", {
        length: diagram.length,
        firstLine: diagram.split("\n")[0],
      });
      return diagram;
    } catch (error) {
      console.error("[TechStack] Diagram conversion error:", error);
      return "";
    }
  }, [data.architecture]);

  const categories = [
    {
      id: 1,
      key: "frontend",
      title: "Frontend",
      icon: "🎨",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: 2,
      key: "backend",
      title: "Backend",
      icon: "⚙️",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: 3,
      key: "database",
      title: "Database",
      icon: "💾",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      id: 4,
      key: "API_integrations",
      title: "API Integrations",
      icon: "🔌",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      id: 5,
      key: "others",
      title: "Others",
      icon: "🛠️",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
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

  if (!data.architecture?.architectureDiagram?.diagramData) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading architecture diagram...</p>
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

      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Recommended Tech Stack
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              !data.techStack?.[category.key as keyof TechStackData]?.length
                ? "opacity-50"
                : ""
            }`}
          >
            <div className="flex items-center gap-3 pb-2 mb-4 border-b-2 border-gray-100">
              <span className="text-2xl" role="img" aria-label={category.title}>
                {category.icon}
              </span>
              <h3 className="text-xl font-semibold text-gray-700">
                {category.title}
              </h3>
            </div>

            <div className="space-y-4">
              {data.techStack?.[category.key as keyof TechStackData]?.map(
                (tech, index) => (
                  <div
                    key={index}
                    className={`${category.bgColor} rounded-lg p-4 border ${category.borderColor} transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-800">
                        {tech.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                )
              )}
            </div>

            {!data.techStack?.[category.key as keyof TechStackData]?.length && (
              <div className="text-center text-gray-500 py-4">
                No {category.title.toLowerCase()} technologies recommended
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AITechStack;

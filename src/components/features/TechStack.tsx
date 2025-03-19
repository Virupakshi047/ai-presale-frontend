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

// interface ArchitectureResponse {
//   message: string;
//   architectureDiagram: {
//     _id: string;
//     project: string;
//     diagramData: {
//       nodes: Array<{
//         id: string;
//         attributes: {
//           type: string;
//           technology: string;
//         };
//       }>;
//       edges: Array<{
//         source: string;
//         target: string;
//         attributes: {
//           protocol: string;
//         };
//       }>;
//     };
//     createdAt: string;
//     __v: number;
//   };
// }

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
  const [techStack, setTechStack] = useState<TechStackData | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTechStack = async () => {
      if (!currentProject?._id) {
        setIsLoading(false);
        return;
      }

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

        const data: TechStackResponse = await response.json();

        if (isMounted && data.techStack) {
          setTechStack(data.techStack);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : "Error fetching tech stack"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTechStack();
    return () => {
      isMounted = false;
    };
  }, [currentProject?._id]);

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
    !techStack || Object.values(techStack).every((arr) => arr.length === 0);

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
            <span>Go to Requirements Analysis</span>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-700 pb-2 mb-4 border-b-2 border-gray-100">
              {category.title}
            </h3>
            <div className="space-y-4">
              {techStack?.[category.key as keyof TechStackData]?.map(
                (tech, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
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

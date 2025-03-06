"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Technology {
  name: string;
  description: string;
}

interface TechStackData {
  frontend: Technology[];
  backend: Technology[];
  database: Technology[];
  API_integrations: Technology[];
  others: Technology[];
}

interface AITechStackProps {
  projectId: string;
}

const AITechStack: React.FC<AITechStackProps> = ({ projectId }) => {
  const router = useRouter();
  const [techStackData, setTechStackData] = useState<TechStackData | null>({
    frontend: [
      {
        name: "React",
        description:
          "Versatile, efficient, and widely-used for building user interfaces",
      },
      // ... other frontend technologies
    ],
    backend: [
      {
        name: "Node.js",
        description: "For building the server-side application",
      },
      // ... other backend technologies
    ],
    database: [
      {
        name: "MongoDB",
        description: "For storing and retrieving data, flexible schema design",
      },
    ],
    API_integrations: [
      {
        name: "FIFA API",
        description: "For data provider integration",
      },
      // ... other API integrations
    ],
    others: [
      {
        name: "Jest",
        description: "For testing the frontend and backend",
      },
      // ... other technologies
    ],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        // Simulating API call
        console.log("Fetching data for project:", projectId);
        // Replace with actual API call
        setIsLoading(false);
        // If no data, setTechStackData(null)
      } catch (error) {
        console.error("Error fetching tech stack:", error);
        setTechStackData(null);
        setIsLoading(false);
      }
    };

    fetchTechStack();
  }, [projectId]);

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

  const isTechStackEmpty =
    !techStackData ||
    Object.values(techStackData).every((arr) => arr.length === 0);

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
            onClick={() => router.push("/dashboard")}
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
        <div className="w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
          <img
            src="/dummy-architecture.png"
            alt="System Architecture"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-md p-6 transition-transform duration-200 hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-gray-700 pb-2 mb-4 border-b-2 border-gray-100">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {techStackData[category.key as keyof TechStackData]?.map(
                (tech, index) => (
                  <div key={index} className="relative group">
                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                      {tech.name}
                    </span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {tech.description}
                      <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
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

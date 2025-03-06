"use client";
import React, { useEffect, useState } from "react";

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
  const [techStackData, setTechStackData] = useState<TechStackData>({
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

  useEffect(() => {
    // API call will go here
    console.log("Fetching data for project:", projectId);
  }, [projectId]);

  const categories = [
    { id: 1, key: "frontend", title: "Frontend" },
    { id: 2, key: "backend", title: "Backend" },
    { id: 3, key: "database", title: "Database" },
    { id: 4, key: "API_integrations", title: "API Integrations" },
    { id: 5, key: "others", title: "Others" },
  ];

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
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {tech.description}
                      {/* Arrow */}
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

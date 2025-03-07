"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Project {
  _id: string;
  name: string;
  requirements: any[];
  createdBy: string;
  assignedUsers: string[];
  createdAt: string;
}

export default function Sidebar() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8080/project", {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data: Project[] = await response.json();
        setProjects(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching projects"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Extract project name from URL or default to first project
  let activeProject = "";
  if (pathname === "/dashboard") {
    activeProject = projects[0]?.name || "";
  } else {
    const projectFromPath = decodeURIComponent(pathname.split("/").pop() || "");
    activeProject =
      projects.find((p) => p.name === projectFromPath)?.name ||
      projects[0]?.name ||
      "";
  }

  return (
    <div className="w-64 bg-gray-100 p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Projects</h2>

      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-2">{error}</div>
      ) : (
        <ul>
          {projects.map((project) => (
            <li
              key={project._id}
              className={`p-2 rounded cursor-pointer mb-2 ${
                activeProject === project.name
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => {
                const encodedProject = encodeURIComponent(project.name);
                router.push(`/dashboard/${encodedProject}`);
              }}
            >
              {project.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

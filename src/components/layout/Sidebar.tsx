"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Hamburger from "../ui/Hamburger";

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
  const [isOpen, setIsOpen] = useState(false);

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

  // Add click handler for mobile overlay
  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Hamburger Menu - Increased z-index */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <Hamburger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      </div>

      {/* Sidebar - Adjusted z-index and added proper height constraints */}
      <div
        className={`fixed lg:sticky lg:top-0 w-64 bg-gray-100 h-screen overflow-y-auto 
        p-4 transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        shadow-lg lg:shadow-none flex-shrink-0`}
      >
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-100 py-2">
          <h2 className="text-xl font-bold">Projects</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 p-2">{error}</div>
        ) : (
          <ul className="space-y-2">
            {projects.map((project) => (
              <li
                key={project._id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200
                ${
                  activeProject === project.name
                    ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  const encodedProject = encodeURIComponent(project.name);
                  router.push(`/dashboard/${encodedProject}`);
                  setIsOpen(false); // Close sidebar on mobile after selection
                }}
              >
                {project.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

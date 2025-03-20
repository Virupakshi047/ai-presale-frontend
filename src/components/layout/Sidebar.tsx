"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Hamburger from "../ui/Hamburger";
import { Menu, X, Plus, Trash2 } from "lucide-react";

interface Project {
  _id: string;
  name: string;
  requirements: any[];
  createdBy: string;
  assignedUsers: string[];
  createdAt: string;
}
interface UserData {
  name: string;
  email: string;
  role: string;
}

interface CreateProjectResponse {
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
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // Add this state for user data
  const [userData, setUserData] = useState<UserData | null>(null);

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

  // Add this to your existing useEffect or create a new one
  useEffect(() => {
    const userDataFromStorage = getLoggedUserData();
    setUserData(userDataFromStorage);
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

  const getLoggedUserData = (): UserData | null => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  };

  // Add this helper function to check permissions
  const hasFullAccess = userData?.role === "head";

  // Add this function to handle project creation
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch("http://localhost:8080/project", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: newProjectName,
          createdBy: "67d5539c1ae9799ec0e8f377",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const newProject: CreateProjectResponse = await response.json();

      // Update projects list first
      setProjects((prev) => [...prev, newProject]);
      setNewProjectName("");
      setShowModal(false);

      // Force a reload of the page with the new project route
      window.location.href = `/dashboard/${encodeURIComponent(
        newProject.name
      )}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating project");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditProject = async (projectId: string, newName: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/project/${projectId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ name: newName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      // Update projects list with new name
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? { ...p, name: newName } : p))
      );

      // Reset editing state
      setEditingId(null);
      setEditingName("");

      // Update URL if this was the active project
      if (activeProject === projects.find((p) => p._id === projectId)?.name) {
        router.push(`/dashboard/${encodeURIComponent(newName)}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating project");
    }
  };

  // Add delete handler function inside Sidebar component
  const handleDeleteProject = async (
    projectId: string,
    projectName: string
  ) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/project/${projectId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      // Remove project from state
      setProjects((prev) => prev.filter((p) => p._id !== projectId));

      // If deleted project was active, redirect to first available project or dashboard
      if (activeProject === projectName) {
        const remainingProjects = projects.filter((p) => p._id !== projectId);
        if (remainingProjects.length > 0) {
          router.push(
            `/dashboard/${encodeURIComponent(remainingProjects[0].name)}`
          );
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting project");
    }
  };

  return (
    <>
      {/* Mobile Menu Button - Simplified */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-md hover:bg-gray-50 transition-colors"
        >
          {isOpen ? (
            <X size={20} className="text-gray-600" />
          ) : (
            <Menu size={20} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar - Updated positioning */}
      <div
        className={`fixed lg:sticky top-0 lg:top-20 w-64 bg-gray-100 h-[calc(100vh-5rem)] overflow-y-auto 
        p-4 transform transition-transform duration-300 ease-in-out z-30
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        shadow-lg lg:shadow-none flex-shrink-0`}
      >
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-100 py-2">
          <h2 className="text-xl font-bold">Projects</h2>
          {hasFullAccess && (
            <button
              onClick={() => setShowModal(true)}
              className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              title="Create new project"
            >
              <Plus size={20} className="cursor-pointer" />
            </button>
          )}
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
                className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 relative
              ${
                activeProject === project.name
                  ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                  : "hover:bg-gray-200"
              }`}
              >
                <div className="flex items-center justify-between">
                  {editingId === project._id && hasFullAccess ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && editingName.trim()) {
                          handleEditProject(project._id, editingName.trim());
                        } else if (e.key === "Escape") {
                          setEditingId(null);
                          setEditingName("");
                        }
                      }}
                      onBlur={() => {
                        if (
                          editingName.trim() &&
                          editingName !== project.name
                        ) {
                          handleEditProject(project._id, editingName.trim());
                        } else {
                          setEditingId(null);
                          setEditingName("");
                        }
                      }}
                      className="flex-1 px-1 bg-transparent border-b border-blue-500 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => {
                        const encodedProject = encodeURIComponent(project.name);
                        router.push(`/dashboard/${encodedProject}`);
                        setIsOpen(false);
                      }}
                      onDoubleClick={() => {
                        if (hasFullAccess) {
                          setEditingId(project._id);
                          setEditingName(project.name);
                        }
                      }}
                      className="flex-1 cursor-pointer"
                    >
                      {project.name}
                    </span>
                  )}
                  {hasFullAccess && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(project._id);
                          setEditingName(project.name);
                        }}
                        className="p-1 hover:bg-blue-100 rounded transition-all duration-200"
                        title="Edit project name"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-500"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project._id, project.name);
                        }}
                        className="p-1 hover:bg-red-100 rounded transition-all duration-200"
                        title="Delete project"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mobile Overlay - Updated z-index */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Only render modal if user has full access */}
      {showModal && hasFullAccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4">Create New Project</h3>

            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name"
                className="w-full p-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />

              <button
                type="submit"
                disabled={isCreating || !newProjectName.trim()}
                className={`w-full py-2 px-4 rounded-lg text-white ${
                  isCreating || !newProjectName.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isCreating ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Creating...
                  </span>
                ) : (
                  "Create Project"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

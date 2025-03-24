"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Plus, Trash2, Edit } from "lucide-react";

interface Requirement {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
}

interface Project {
  _id: string;
  name: string;
  requirements: Requirement[];
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
  requirements: Requirement[];
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
  const [userData, setUserData] = useState<UserData | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/project`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

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

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  const getLoggedUserData = (): UserData | null => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  };

  const hasFullAccess = userData?.role === "head";

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/project`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newProjectName,
            createdBy: "67d5539c1ae9799ec0e8f377",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const newProject: CreateProjectResponse = await response.json();

      setProjects((prev) => [...prev, newProject]);
      setNewProjectName("");
      setShowModal(false);

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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${projectId}`,
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

      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? { ...p, name: newName } : p))
      );

      setEditingId(null);
      setEditingName("");

      if (activeProject === projects.find((p) => p._id === projectId)?.name) {
        router.push(`/dashboard/${encodeURIComponent(newName)}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating project");
    }
  };

  const handleDeleteProject = async (
    projectId: string,
    projectName: string
  ) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${projectId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects((prev) => prev.filter((p) => p._id !== projectId));

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
      {/* Mobile Menu Button - Positioned for navbar compatibility */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-md hover:bg-gray-50 transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X size={20} className="text-gray-600" />
          ) : (
            <Menu size={20} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Main Sidebar - Adjusted for navbar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 w-64 bg-white border-r border-gray-200 h-screen lg:h-[calc(100vh-4rem)] 
        overflow-y-auto pt-16 lg:pt-4 pb-4 px-4 transform transition-transform duration-300 ease-in-out z-30
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        shadow-lg lg:shadow-none flex-shrink-0`}
      >
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white py-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Projects</h2>
          {hasFullAccess && (
            <button
              onClick={() => setShowModal(true)}
              className="p-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
              title="Create new project"
            >
              <Plus size={18} />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 p-3 bg-red-50 rounded-md my-3">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No projects found
            {hasFullAccess && (
              <div className="mt-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="text-blue-500 hover:underline"
                >
                  Create your first project
                </button>
              </div>
            )}
          </div>
        ) : (
          <ul className="space-y-1">
            {projects.map((project) => (
              <li
                key={project._id}
                className={`group rounded-md transition-all duration-200 relative
                ${
                  activeProject === project.name
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center py-2 px-3">
                  {editingId === project._id && hasFullAccess ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (
                          editingName.trim() &&
                          editingName !== project.name
                        ) {
                          handleEditProject(project._id, editingName.trim());
                        }
                      }}
                      className="flex-1"
                    >
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
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
                        className="w-full px-1 py-1 bg-white border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                        autoFocus
                      />
                    </form>
                  ) : (
                    <button
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
                      className="flex-1 text-left truncate py-1 cursor-pointer"
                    >
                      {project.name}
                    </button>
                  )}

                  {hasFullAccess && (
                    <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(project._id);
                          setEditingName(project.name);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded-md"
                        title="Edit project name"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project._id, project.name);
                        }}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-md ml-1"
                        title="Delete project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Create Project Modal */}
      {showModal && hasFullAccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Create New Project
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleCreateProject}>
                <div className="mb-4">
                  <label
                    htmlFor="projectName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Project Name
                  </label>
                  <input
                    id="projectName"
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !newProjectName.trim()}
                    className={`px-4 py-2 rounded-md text-white ${
                      isCreating || !newProjectName.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    }`}
                  >
                    {isCreating ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating...
                      </span>
                    ) : (
                      "Create Project"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

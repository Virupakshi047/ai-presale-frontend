"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AssignedUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Version {
  version: string;
  updatedBy: string;
  timestamp: string;
}

interface Project {
  _id: string;
  name: string;
  requirements: string[];
  createdBy: string;
  updatedBy: string;
  assignedUsers: AssignedUser[];
  createdAt: string;
  updatedAt?: string;
  __v: number;
  techStacks?: string;
  architectureDiagram?: string;
  userPersona?: string;
  effortEstimationUrl?: string;
  wireframe?: string;
  versions: Version[];
}

interface ProjectContextType {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

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

        // Set first project as default if no project is selected
        if (!currentProject && data.length > 0) {
          setCurrentProject(data[0]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [currentProject]);

  return (
    <ProjectContext.Provider
      value={{ currentProject, setCurrentProject, projects, setProjects }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}

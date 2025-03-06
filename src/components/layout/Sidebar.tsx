"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  // Dummy projects for now
  const projects = ["Project 1", "Project 2", "Project 3"];
  const router = useRouter();
  const pathname = usePathname();

  // Extract project name from URL or default to first project
  let activeProject = "";

  if (pathname === "/dashboard") {
    activeProject = "Project 1";
  } else {
    const projectFromPath = decodeURIComponent(pathname.split("/").pop() || "");
    activeProject = projects.includes(projectFromPath)
      ? projectFromPath
      : "Project 1";
  }

  return (
    <div className="w-64 bg-gray-100 p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      <ul>
        {projects.map((project, index) => (
          <li
            key={index}
            className={`p-2 rounded cursor-pointer mb-2 ${
              activeProject === project
                ? "bg-blue-100 text-blue-700 font-medium"
                : "hover:bg-gray-200"
            }`}
            onClick={() => {
              if (project === "Project 1" && pathname === "/dashboard") {
                // Already on dashboard with default project
                return;
              }

              // Navigate to the project dashboard
              const encodedProject = encodeURIComponent(project);
              router.push(`/dashboard/${encodedProject}`);
            }}
          >
            {project}
          </li>
        ))}
      </ul>
    </div>
  );
}

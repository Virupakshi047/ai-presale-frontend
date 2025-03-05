export default function Sidebar() {
  // Dummy projects for now
  const projects = ["Project 1", "Project 2", "Project 3"];

  return (
    <div className="w-64 bg-gray-100 p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      <ul>
        {projects.map((project, index) => (
          <li
            key={index}
            className="p-2 hover:bg-gray-200 rounded cursor-pointer mb-2"
          >
            {project}
          </li>
        ))}
      </ul>
    </div>
  );
}

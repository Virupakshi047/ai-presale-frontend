import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useProject } from "@/context/ProjectContext";
import { X } from "lucide-react";

interface User {
  _id: string;
  name: string;
  role: string;
  email: string;
}

interface LoggedUserData {
  name: string;
  email: string;
  role: string;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: "head" | "associate" | "junior";
}

export default function AssignProject() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAssignedUsers, setShowAssignedUsers] = useState(false);
  const [loggedUser, setLoggedUser] = useState<LoggedUserData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createUserData, setCreateUserData] = useState<CreateUserData>({
    name: "",
    email: "",
    password: "",
    role: "junior",
  });

  const { currentProject, setCurrentProject, projects, setProjects } =
    useProject();

  // Fetch available users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/user", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast.error("Failed to load users");
        console.error(error);
      }
    };
    fetchUsers();
    const userData = getLoggedUserData();
    setLoggedUser(userData);
  }, []);

  const getLoggedUserData = (): LoggedUserData | null => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  };
  const filteredUsers = users.filter((user) => {
    // Don't show already assigned users
    const isAssigned = currentProject?.assignedUsers.find(
      (u) => u._id === user._id
    );

    // If logged user is not head, don't show head users
    const shouldHideHead = loggedUser?.role == "head" && user.role === "head";

    return !isAssigned && !shouldHideHead;
  });

  const hasManageAccess = loggedUser?.role === "head";

  const handleAssign = async () => {
    if (!selectedUser || !currentProject) return;

    // Check if current user is head and trying to assign another head
    const selectedUserData = users.find((u) => u._id === selectedUser);
    const hasHeadRole = currentProject.assignedUsers.some(
      (u) => u.role === "head"
    );

    if (hasHeadRole && selectedUserData?.role === "head") {
      toast.error("Cannot assign another head to this project");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/project/${currentProject._id}/assign/${selectedUser}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to assign user");
      }

      // Update projects list
      const updatedProjects = projects.map((project) =>
        project._id === currentProject._id ? data.project : project
      );

      setProjects(updatedProjects);
      setCurrentProject(data.project);
      toast.success("User assigned successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to assign user"
      );
    } finally {
      setLoading(false);
      setShowModal(false);
      setSelectedUser("");
    }
  };

  const handleUnassign = async (userId: string) => {
    if (!currentProject) return;

    // Prevent unassigning if user is head
    const userToUnassign = currentProject.assignedUsers.find(
      (u) => u._id === userId
    );
    if (userToUnassign?.role === "head") {
      toast.error("Cannot unassign head from the project");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/project/${currentProject._id}/unassign/${userId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unassign user");
      }

      const data = await response.json();

      // Update projects list
      const updatedProjects = projects.map((project) =>
        project._id === currentProject._id ? data.project : project
      );

      setProjects(updatedProjects);
      setCurrentProject(data.project);
      toast.success("User unassigned successfully");
    } catch (error) {
      toast.error("Failed to unassign user");
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(createUserData),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const data = await response.json();
      setUsers([...users, data]);
      toast.success("User created successfully");
      setShowCreateModal(false);
      setCreateUserData({
        name: "",
        email: "",
        password: "",
        role: "junior",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create user"
      );
    }
  };

  return (
    <div>
      {hasManageAccess && (
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
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
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Assign Users
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Management of Users</h3>
              <button
                onClick={() => setShowAssignedUsers(!showAssignedUsers)}
                className="text-sm px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {showAssignedUsers
                  ? "Show Available Users"
                  : "Show Assigned Users"}
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {showAssignedUsers
                ? // Show assigned users
                  currentProject?.assignedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200"
                    >
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 mt-1">
                          {user.role}
                        </span>
                      </div>
                      {user.role !== "head" && (
                        <button
                          onClick={() => handleUnassign(user._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Unassign
                        </button>
                      )}
                    </div>
                  ))
                : // Show available users
                  filteredUsers.map((user) => (
                    <label
                      key={user._id}
                      className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedUser === user._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="user"
                        value={user._id}
                        checked={selectedUser === user._id}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="mt-1"
                      />
                      <div className="ml-3">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 mt-1">
                          {user.role}
                        </span>
                      </div>
                    </label>
                  ))}
            </div>

            <div className="flex justify-between gap-3 mt-6">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create User
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                {!showAssignedUsers && (
                  <button
                    onClick={handleAssign}
                    disabled={!selectedUser || loading}
                    className={`px-4 py-2 rounded-lg ${
                      selectedUser && !loading
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {loading ? "Assigning..." : "Assign"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] max-w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Create New User</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateUser();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={createUserData.name}
                  onChange={(e) =>
                    setCreateUserData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={createUserData.email}
                  onChange={(e) =>
                    setCreateUserData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={createUserData.password}
                  onChange={(e) =>
                    setCreateUserData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={createUserData.role}
                  onChange={(e) =>
                    setCreateUserData((prev) => ({
                      ...prev,
                      role: e.target.value as CreateUserData["role"],
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="junior">Junior</option>
                  <option value="associate">Associate</option>
                  <option value="head">Head</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

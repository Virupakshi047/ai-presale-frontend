import { useState } from "react";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

const dummyUsers: User[] = [
  { id: "1", name: "John Doe", role: "junior", email: "john@example.com" },
  { id: "2", name: "Jane Smith", role: "junior", email: "jane@example.com" },
  { id: "3", name: "Mike Johnson", role: "head", email: "mike@example.com" },
  { id: "4", name: "Sarah Wilson", role: "junior", email: "sarah@example.com" },
];

export default function AssignProject() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const handleAssign = () => {
    if (!selectedUser) return;

    // Simulate assignment
    toast.success(
      `Project assigned to ${
        dummyUsers.find((u) => u.id === selectedUser)?.name
      }`
    );
    setShowModal(false);
    setSelectedUser("");
  };

  return (
    <>
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
        Assign Project
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Assign Project</h3>
            <div className="space-y-4">
              {dummyUsers
                .filter((user) => user.role !== "head")
                .map((user) => (
                  <label
                    key={user.id}
                    className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedUser === user.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="user"
                      value={user.id}
                      checked={selectedUser === user.id}
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
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedUser}
                className={`px-4 py-2 rounded-lg ${
                  selectedUser
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

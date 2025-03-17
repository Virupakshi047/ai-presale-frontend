import Image from "next/image";
import { User, Bell, Settings, LogOut, Home } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/logout", {
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("userData");
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        {/* Logo Placeholder */}
        <div className="w-12 h-12 bg-gray-200 rounded">
          {/* Add your logo here */}
        </div>
      </div>

      {/* Right Side Navigation */}
      <div className="flex items-center space-x-6">
        {/* Navigation Links */}
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Home size={18} />
          <span className="hidden md:inline">Dashboard</span>
        </Link>
        <Link
          href="/projects"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Projects
        </Link>
        <Link
          href="/analytics"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Analytics
        </Link>
        {/* Notifications */}
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} className="text-gray-600 cursor-pointer" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
              <User className="text-white" />
            </div>
            <span className="text-gray-700 hidden md:inline">
              {userData?.name || "User"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
              <Link
                href="/profile"
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <User size={16} className="mr-2" />
                Profile
              </Link>
              <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50">
                <Settings size={16} className="mr-2" />
                Settings
              </button>
              <hr className="my-2 border-gray-100" />
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-50"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

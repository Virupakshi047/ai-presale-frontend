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
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-40 border-b border-gray-100">
      <div className="flex items-center space-x-6">
        {/* Logo and Welcome Message */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg flex items-center justify-center">
            {/* Replace with your actual logo */}
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div className="ml-4 hidden md:block">
            <h1 className="text-gray-700 font-medium">
              Welcome back,{" "}
              <span className="text-blue-600 font-semibold">
                {userData?.name || "User"}
              </span>
            </h1>
            <p className="text-sm text-gray-500">{userData?.role || "Guest"}</p>
          </div>
        </div>
      </div>

      {/* Right Side Navigation */}
      <div className="flex items-center space-x-6">
        {/* Dashboard Link */}
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-md hover:bg-blue-50"
        >
          <Home size={18} className="stroke-2" />
          <span className="hidden md:inline font-medium">Dashboard</span>
        </Link>

        {/* Notifications - You can uncomment and style this part */}
        {/* <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-md">
          <Bell size={18} className="stroke-2" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button> */}

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
              <User className="text-white stroke-[2.5]" size={20} />
            </div>
          </button>

          {/* Enhanced Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 border border-gray-100 transform transition-all duration-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-900">
                  {userData?.email}
                </p>
              </div>
              <Link
                href="/profile"
                className="flex items-center w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <User size={16} className="mr-3 stroke-2" />
                Profile
              </Link>
              <button className="flex items-center w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                <Settings size={16} className="mr-3 stroke-2" />
                Settings
              </button>
              <hr className="my-2 border-gray-100" />
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} className="mr-3 stroke-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

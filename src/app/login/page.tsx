"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include", // Important for handling cookies
        }
      );

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store user data in localStorage
      // Example: Fixing localStorage Error

      // Check if user is head and redirect accordingly
      if (
        data.user.role === "head" ||
        data.user.role === "junior" ||
        data.user.role === "associate"
      ) {
        router.push("/dashboard");
      } else {
        setError("Access denied. Only head role is allowed.");
        localStorage.removeItem("userData"); // Clear storage if access denied
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Invalid credentials");
      localStorage.removeItem("userData"); // Clear storage on error
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background with overlay */}
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-0">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Welcome Back!</h2>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <div className="group relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="group relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2
                           hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl flex items-center justify-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Invalid email or password</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-3 
                       bg-gradient-to-r from-blue-600 to-blue-700 
                       hover:from-blue-700 hover:to-blue-800
                       text-white font-medium rounded-xl
                       transform transition-all duration-200 
                       hover:scale-[1.02] active:scale-[0.98]
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

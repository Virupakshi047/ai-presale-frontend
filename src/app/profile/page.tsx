"use client";

import { useEffect, useState } from "react";
import { User, Mail, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("userData");
      if (!storedData) {
        router.push("/login");
        return;
      }
      setUserData(JSON.parse(storedData));
    }
  }, [router]);

  if (!userData) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{userData.name}</h1>
              <p className="text-blue-100 mt-2">{userData.role}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-700">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Shield className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-gray-700 capitalize">{userData.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

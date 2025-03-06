"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MainBody from "@/components/layout/MainBody";

export default function ProjectDashboardPage() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow bg-gray-50 overflow-auto">
          <MainBody />
        </main>
      </div>
    </div>
  );
}

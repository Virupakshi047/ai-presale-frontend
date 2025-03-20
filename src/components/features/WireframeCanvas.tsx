"use client";

import { useEffect, useState } from "react";
import { useProject } from "@/context/ProjectContext";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";

interface WireframeResponse {
  message: string;
  wireframe: {
    _id: string;
    image_link: string[];
    __v: number;
  };
}

export default function WireframeCanvas() {
  const { currentProject } = useProject();
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchWireframes = async () => {
      if (!currentProject?._id) return;

      try {
        const response = await fetch(
          `http://localhost:8080/wireframe/${currentProject._id}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch wireframes");
        }

        const data: WireframeResponse = await response.json();
        setImages(data.wireframe.image_link);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load wireframes"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchWireframes();
  }, [currentProject?._id]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="text-center text-gray-500 p-4">
        <p>No wireframes available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold text-gray-800 p-5">
        Generated Wireframes
      </h2>
      {/* Main Container */}
      <div
        className={`relative ${
          isFullscreen
            ? "fixed inset-0 z-50 bg-black"
            : "rounded-lg overflow-hidden"
        }`}
      >
        {/* Image Container */}
        <div
          className={`relative ${
            isFullscreen ? "h-screen" : "h-[600px]"
          } bg-gray-900`}
        >
          <img
            src={images[currentIndex]}
            alt={`Wireframe ${currentIndex + 1}`}
            className={`w-full h-full object-contain ${
              isFullscreen ? "p-4" : ""
            }`}
          />

          {/* Navigation Controls */}
          <div
            className={`absolute inset-0 flex items-center justify-between p-4 ${
              isFullscreen ? "px-8" : ""
            }`}
          >
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === images.length - 1}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Fullscreen Controls */}
          <div
            className={`absolute ${
              isFullscreen ? "top-4 right-4" : "top-2 right-2"
            }`}
          >
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>

          {/* Page Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="mt-4 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? "bg-blue-500 w-4" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useRouter } from "next/navigation";

const VisionImprovementHub = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl shadow-lg rounded-lg backdrop-blur-sm bg-white/50 p-6">
        <h2 className="text-center text-gray-800 text-3xl font-medium mb-4">
          Vision Diagnosis and Improvement
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Our platform offers various options to test and improve your vision,
          focusing on blurred vision, color blindness, and visual field
          assessment.
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            className="w-full sm:w-auto px-6 py-3 rounded text-white font-medium transition-colors"
            style={{ backgroundColor: '#FBBF24' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F59E0B'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FBBF24'}
            onClick={() => router.push("/blur")}
          >
            Blurred Vision Test
          </button>
          <button
            className="w-full sm:w-auto px-6 py-3 rounded text-white font-medium transition-colors"
            style={{ backgroundColor: '#FB923C' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FB923C'}
            onClick={() => router.push("/color")}
          >
            Color Blindness Test
          </button>
          <button
            className="w-full sm:w-auto px-6 py-3 rounded text-white font-medium transition-colors"
            style={{ backgroundColor: '#0D9488' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0F766E'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0D9488'}
            onClick={() => router.push("/field")}
          >
            Visual Field Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisionImprovementHub;
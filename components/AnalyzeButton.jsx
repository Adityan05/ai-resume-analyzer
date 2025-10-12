"use client";

import React from "react";
import { FiLoader } from "react-icons/fi";
import { LuBrainCircuit } from "react-icons/lu";

const AnalyzeButton = ({ onAnalyze, disabled = false, loading = false }) => {
  const handleAnalyze = async () => {
    try {
      await onAnalyze();
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleAnalyze}
        disabled={disabled || loading}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          disabled || loading
            ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
        }`}
      >
        {loading ? (
          <>
            <FiLoader className="w-5 h-5 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <LuBrainCircuit className="w-5 h-5" />
            <span>Analyze with AI</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AnalyzeButton;

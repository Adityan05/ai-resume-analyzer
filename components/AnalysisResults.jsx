"use client";

import { FiTrendingUp, FiEdit3, FiCheckCircle, FiStar } from "react-icons/fi";

const AnalysisResults = ({ analysisResult }) => {
  if (!analysisResult) return null;

  const { summary, improvements, rewrites, nonResumeMessage } = analysisResult;

  const getScoreColor = (score) => {
    if (score >= 8)
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
    if (score >= 6)
      return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
  };

  const getProgressColor = (score) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mt-8 space-y-6 animate-fade-in">
      {/* Overall Score */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-300 hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <FiStar className="w-6 h-6 mr-2 text-yellow-500" />
            Analysis Results
          </h2>
          <div
            className={`px-4 py-2 rounded-full text-lg font-bold ${getScoreColor(
              summary.overallScore
            )} transition-all duration-300`}
          >
            {summary.overallScore}/100
          </div>
        </div>

        {/* Individual Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(summary.scores).map(([key, score], index) => (
            <div
              key={key}
              className="space-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {key.replace("_", " ")}
                </span>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(
                    score
                  )}`}
                >
                  {score}/10
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${getProgressColor(
                    score
                  )}`}
                  style={{ width: `${(score / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Non-Resume Message */}
        {!summary.isResume && nonResumeMessage && (
          <div className="mt-4 animate-fade-in">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                📄 Document Type Notice
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {nonResumeMessage}
              </p>
            </div>
          </div>
        )}

        {/* Comments */}
        {summary.comments && summary.comments.length > 0 && (
          <div className="mt-4 animate-fade-in">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Key Insights
            </h3>
            <ul className="space-y-1">
              {summary.comments.map((comment, index) => (
                <li
                  key={index}
                  className="flex items-start text-sm text-gray-600 dark:text-gray-400 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <FiCheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                  {comment}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Improvements */}
      {improvements && Object.keys(improvements).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Improvement Suggestions
          </h2>
          <div className="space-y-4">
            {Object.entries(improvements).map(([section, suggestion]) => (
              <div key={section} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize mb-1">
                  {section}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewrites */}
      {rewrites && Object.keys(rewrites).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <FiEdit3 className="w-5 h-5 mr-2 text-purple-500" />
            Professional Rewrites
          </h2>
          <div className="space-y-4">
            {Object.entries(rewrites).map(([section, rewrite]) => (
              <div key={section} className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {section}
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {rewrite}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Print Results
        </button>
        <button
          onClick={() => {
            const dataStr = JSON.stringify(analysisResult, null, 2);
            const dataBlob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "resume-analysis.json";
            link.click();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Download JSON
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;

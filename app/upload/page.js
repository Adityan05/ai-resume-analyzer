"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import FileUpload from "@/components/FileUpload";
import AnalyzeButton from "@/components/AnalyzeButton";
import AnalysisResults from "@/components/AnalysisResults";
import Link from "next/link";

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [userCredits, setUserCredits] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/signin?redirect=/upload");
        return;
      }
      setUser(user);

      // Fetch user credits
      try {
        const { data, error } = await supabase
          .from("user_credits")
          .select("credits")
          .eq("user_id", user.id)
          .single();

        if (error && error.code === "PGRST116") {
          // User doesn't have credits record, create one
          const { data: newCredits } = await supabase
            .from("user_credits")
            .insert({ user_id: user.id, credits: 500 })
            .select("credits")
            .single();
          setUserCredits(newCredits?.credits || 500);
        } else if (data) {
          setUserCredits(data.credits);
        }
      } catch (error) {
        console.error("Error fetching user credits:", error);
        setUserCredits(500); // Default fallback
      }

      setLoading(false);
    };

    getUser();
  }, [router, supabase]);

  const handleFileSelect = (file) => {
    setUploadedFile(file);
  };

  const handleJobDescriptionChange = (description) => {
    setJobDescription(description);
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setUploadedFile(null);
    setJobDescription("");
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    // Check if user has sufficient credits
    if (userCredits < 50) {
      alert("Insufficient credits. You need 50 credits to perform a scan.");
      return;
    }

    setAnalyzing(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", uploadedFile);
      if (jobDescription) {
        formData.append("jobDescription", jobDescription);
      }

      // Call the analysis API
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Analysis failed";

        if (errorData?.error) {
          if (typeof errorData.error === "string") {
            errorMessage = errorData.error;
          } else if (typeof errorData.error === "object") {
            errorMessage =
              errorData.error.message || JSON.stringify(errorData.error);
          }
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        }

        // Show a user-friendly message but do not throw to avoid Next.js overlay
        console.warn("Analysis failed:", errorMessage);
        alert(errorMessage);
        setAnalyzing(false);
        return;
      }

      const result = await response.json();

      // Store the result instead of showing alert
      setAnalysisResult(result);

      // Update credits after successful analysis
      setUserCredits((prev) => prev - 50);

      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById("analysis-results");
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      console.error("Analysis error:", error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              Upload Resume
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your resume to get AI-powered analysis and insights
            </p>
          </div>

          {/* Credits Display */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Available Credits
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  Each scan costs 50 credits
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {userCredits}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  credits
                </div>
              </div>
            </div>
            {userCredits < 50 && (
              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  ⚠️ Insufficient credits. You need 50 credits to perform a
                  scan.
                </p>
              </div>
            )}
          </div>

          <FileUpload
            onFileSelect={handleFileSelect}
            onJobDescriptionChange={handleJobDescriptionChange}
            jobDescription={jobDescription}
            selectedFile={uploadedFile}
          />

          {uploadedFile && !analysisResult && (
            <div className="mt-8">
              <AnalyzeButton
                onAnalyze={handleAnalyze}
                disabled={userCredits < 50 || analyzing}
                loading={analyzing}
              />
            </div>
          )}

          {analysisResult && (
            <div id="analysis-results">
              <AnalysisResults analysisResult={analysisResult} />
              <div className="mt-6 flex justify-center">
                <button
                  onClick={resetAnalysis}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Analyze Another Resume
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

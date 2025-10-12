import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserRecentScans, getUserCredits } from "@/utils/supabase/database";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?redirect=/dashboard");
  }

  // Fetch user's recent scans and credits
  let recentScans = [];
  let userCredits = 500; // Default fallback

  try {
    recentScans = await getUserRecentScans(user.id, 10);
    userCredits = await getUserCredits(user.id);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Use default values if there's an error
    recentScans = [];
    userCredits = 500;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Welcome, {user.user_metadata?.full_name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Email: {user.email}
          </p>

          {/* Credits Display */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
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
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4">
            <Link
              href="/upload"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Analyze Resume
            </Link>
            <Link
              href="/feedback"
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              Give Feedback
            </Link>
          </div>
        </div>

        {/* Recent Scans Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Recent Scans
            </h2>
            {recentScans.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {recentScans.length} scan{recentScans.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {recentScans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No scans yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Upload your first resume to get started with AI-powered analysis
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Upload Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {scan.filename}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {scan.file_type.toUpperCase()} •{" "}
                        {formatDate(scan.scan_date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(scan.scan_date)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

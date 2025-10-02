import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?redirect=/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Welcome, {user.user_metadata?.full_name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Email: {user.email}
          </p>
          <div className="mt-8">
            <p className="text-gray-600 dark:text-gray-400">
              Your dashboard content will appear here...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FeedbackForm from "@/components/FeedbackForm";

export default async function FeedbackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?redirect=/feedback");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              Feedback
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We value your feedback! Please help us improve by sharing your
              experience.
            </p>
          </div>

          <FeedbackForm />
        </div>
      </div>
    </div>
  );
}

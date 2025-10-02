"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function GetStartedButton() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);

    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/signin");
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        disabled
        className="mt-6 inline-flex items-center gap-2 rounded-full
                           bg-gray-900 dark:bg-white text-white dark:text-gray-900
                           px-6 py-3 text-lg font-medium shadow-md hover:shadow-lg transition"
      >
        Get started
        <span className="inline-block -rotate-45">➜</span>
      </button>
    );
  }

  if (loading) {
    return (
      <button
        disabled
        className="mt-6 inline-flex items-center gap-2 rounded-full
                           bg-gray-900 dark:bg-white text-white dark:text-gray-900
                           px-6 py-3 text-lg font-medium shadow-md hover:shadow-lg transition"
      >
        Get started
        <span className="inline-block -rotate-45">➜</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="mt-6 inline-flex items-center gap-2 rounded-full
                           bg-gray-900 dark:bg-white text-white dark:text-gray-900
                           px-6 py-3 text-lg font-medium shadow-md hover:shadow-lg transition cursor-pointer"
    >
      {user ? "Go to Dashboard" : "Get Started"}
      <span className="inline-block -rotate-45">➜</span>
    </button>
  );
}

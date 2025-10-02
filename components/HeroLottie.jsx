/* components/HeroLottie.jsx */
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Lottie from "lottie-react";
import resumeAnim from "@/public/illustrations/resume.json";
import resumeAnimDark from "@/public/illustrations/resume-dark.json";

export default function HeroLottie() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render placeholder during hydration to prevent mismatch
  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
    );
  }

  const data = resolvedTheme === "dark" ? resumeAnimDark : resumeAnim;

  return (
    <Lottie
      key={resolvedTheme} // Force re-mount on theme change
      animationData={data}
      loop
      className="w-full h-auto"
    />
  );
}

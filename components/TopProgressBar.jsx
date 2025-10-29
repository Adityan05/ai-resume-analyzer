"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";

export default function TopProgressBar() {
  const pathname = usePathname();
  const router = useRouter();
  const timeoutRef = useRef(null);

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 120,
      minimum: 0.08,
    });

    // Start progress on same-origin link clicks
    const onClick = (e) => {
      const anchor = e.target.closest("a[href]");
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.href);
      const isSameOrigin = url.origin === window.location.origin;
      const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
      if (
        isSameOrigin &&
        !isModified &&
        url.pathname !== window.location.pathname
      ) {
        NProgress.start();
        // Fallback timeout to ensure progress completes
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          NProgress.done();
        }, 5000);
      }
    };

    document.addEventListener("click", onClick, true);

    // Listen for page navigation events (including full page reloads)
    const handleBeforeUnload = () => {
      NProgress.done();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Monkey-patch router.push/replace to start progress for programmatic navs
    const origPush = router.push;
    const origReplace = router.replace;
    router.push = (...args) => {
      NProgress.start();
      // Fallback timeout to ensure progress completes
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        NProgress.done();
      }, 5000);
      return origPush(...args);
    };
    router.replace = (...args) => {
      NProgress.start();
      // Fallback timeout to ensure progress completes
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        NProgress.done();
      }, 5000);
      return origReplace(...args);
    };

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      router.push = origPush;
      router.replace = origReplace;
    };
  }, [router]);

  // When the pathname updates (new route rendered), finish the progress
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    NProgress.done();
  }, [pathname]);

  return null;
}

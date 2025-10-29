"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";

export default function TopProgressBar() {
  const pathname = usePathname();
  const router = useRouter();

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
      }
    };

    document.addEventListener("click", onClick, true);

    // Monkey-patch router.push/replace to start progress for programmatic navs
    const origPush = router.push;
    const origReplace = router.replace;
    router.push = (...args) => {
      NProgress.start();
      return origPush(...args);
    };
    router.replace = (...args) => {
      NProgress.start();
      return origReplace(...args);
    };

    return () => {
      document.removeEventListener("click", onClick, true);
      router.push = origPush;
      router.replace = origReplace;
    };
  }, [router]);

  // When the pathname updates (new route rendered), finish the progress
  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  return null;
}

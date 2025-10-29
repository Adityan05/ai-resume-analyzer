// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import {
//   FiUpload,
//   FiClock,
//   FiThumbsUp,
//   FiMenu,
//   FiX,
//   FiMoon,
//   FiSun,
//   FiLogIn,
// } from "react-icons/fi";
// import { RiDashboardLine } from "react-icons/ri";
// import { useTheme } from "next-themes";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const { theme, setTheme } = useTheme();

//   /* ---------------- nav data ---------------- */
//   const navItems = [
//     { href: "/upload", label: "Upload", icon: FiUpload },
//     { href: "/dashboard", label: "Dashboard", icon: RiDashboardLine },
//     { href: "/feedback", label: "Feedback", icon: FiThumbsUp },
//   ];

//   /* ---------------- helpers ---------------- */
//   const NavLink = ({ href, label, Icon, mobile }) => (
//     <Link
//       href={href}
//       onClick={() => setOpen(false)}
//       className={`flex items-center gap-2 rounded-lg px-3 py-2
//         text-gray-700 dark:text-gray-200
//         hover:text-gray-900 dark:hover:text-gray-50
//         ${mobile ? "w-full" : ""}`}
//     >
//       <Icon className="h-3.5 w-3.5" />
//       <span className="text-[1.05rem]">{label}</span>
//     </Link>
//   );

//   /* In your Navbar.jsx, replace the ThemeBtn helper with this: */

//   const ThemeBtn = ({ mobile }) => {
//     const [mounted, setMounted] = useState(false);

//     // Prevent hydration mismatch
//     useEffect(() => {
//       setMounted(true);
//     }, []);

//     // Show placeholder during hydration
//     if (!mounted) {
//       return (
//         <div
//           className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
//             mobile ? "w-full" : "p-2"
//           }`}
//         >
//           <div className="h-4.5 w-4.5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
//           {mobile && <span className="text-[1.05rem]">Theme</span>}
//         </div>
//       );
//     }

//     return (
//       <button
//         onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//         className={`flex items-center gap-2 rounded-lg px-3 py-2
//         text-gray-700 dark:text-gray-200
//         hover:bg-gray-100 dark:hover:bg-gray-800
//         ${mobile ? "w-full" : "p-2"}`}
//       >
//         {theme === "light" ? (
//           <FiMoon className="h-4.5 w-4.5" />
//         ) : (
//           <FiSun className="h-4.5 w-4.5" />
//         )}
//         {mobile && (
//           <span className="text-[1.05rem]">
//             {theme === "light" ? "Dark" : "Light"} mode
//           </span>
//         )}
//       </button>
//     );
//   };

//   const LoginBtn = ({ mobile }) => (
//     <button
//       onClick={() => alert("Trigger login")}
//       className={`flex items-center gap-2 rounded-full bg-gray-800 dark:bg-gray-100
//         text-gray-50 dark:text-gray-900 text-[1.05rem]
//         shadow-sm hover:shadow-md px-5 py-2 transition
//         ${mobile ? "w-full" : ""}`}
//     >
//       <FiLogIn className="h-3.5 w-3.5" />
//       <span>Login</span>
//     </button>
//   );

//   /* ---------------- render ---------------- */
//   return (
//     <nav
//       className="w-full h-full bg-white dark:bg-neutral-900
//                 relative z-50"
//       style={{ isolation: "isolate" }}
//     >
//       <div className="mx-auto flex max-w-7xl items-center justify-between h-full px-4 md:px-6">
//         {/* Logo */}
//         <Link
//           href="/"
//           className="text-2xl font-semibold text-gray-900 dark:text-gray-50"
//         >
//           AI&nbsp;Resume&nbsp;Analyzer
//         </Link>

//         {/* Desktop */}
//         <ul className="hidden items-center gap-6 md:flex">
//           {navItems.map(({ href, label, icon }) => (
//             <li key={href}>
//               <NavLink href={href} label={label} Icon={icon} />
//             </li>
//           ))}
//           <li>
//             <ThemeBtn />
//           </li>
//           <li>
//             <LoginBtn />
//           </li>
//         </ul>

//         {/* Hamburger */}
//         <button
//           aria-label="Toggle menu"
//           onClick={() => setOpen(!open)}
//           className="p-2 md:hidden text-gray-700 dark:text-gray-200"
//         >
//           {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
//         </button>
//       </div>

//       {/* Mobile drawer */}

//       {open && (
//         <ul
//           className="absolute top-full left-0 right-0 mx-4 mt-2 space-y-1 p-4 md:hidden
//                bg-gray-50/95 dark:bg-neutral-900/85
//                backdrop-blur-none dark:backdrop-blur-sm
//                rounded-lg shadow-xl border border-gray-200 dark:border-gray-700
//                z-50 animate-dropdown-slide"
//         >
//           {navItems.map(({ href, label, icon }) => (
//             <li key={href}>
//               <NavLink mobile href={href} label={label} Icon={icon} />
//             </li>
//           ))}
//           <li>
//             <ThemeBtn mobile />
//           </li>
//           <li>
//             <LoginBtn mobile />
//           </li>
//         </ul>
//       )}
//     </nav>
//   );
// }
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiUpload,
  FiThumbsUp,
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { RiDashboardLine } from "react-icons/ri";
import { useTheme } from "next-themes";
import AuthButtons from "./AuthButtons";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    { href: "/upload", label: "Upload", icon: FiUpload },
    { href: "/dashboard", label: "Dashboard", icon: RiDashboardLine },
    { href: "/feedback", label: "Feedback", icon: FiThumbsUp },
  ];

  const NavLink = ({ href, label, icon: Icon, mobile }) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={`flex items-center gap-2 rounded-lg px-3 py-2
        text-gray-700 dark:text-gray-200
        hover:text-gray-900 dark:hover:text-gray-50
        ${mobile ? "w-full" : ""}`}
    >
      <Icon />
      {label}
    </Link>
  );

  const ThemeToggle = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return (
        <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
      );
    }

    return (
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          AI Resume Analyzer
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
          <ThemeToggle />
          <AuthButtons />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-dropdown-slide border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:hidden">
          <div className="space-y-2 px-6 py-4">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} mobile />
            ))}
            <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
              <AuthButtons />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

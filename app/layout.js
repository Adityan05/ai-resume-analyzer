import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "next-themes";
const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata = {
  title: "AI Resume Analyzer",
  description:
    "A simple web app that analyzes your résumé in seconds and helps you improve it.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${dmSans.className} ${dmSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

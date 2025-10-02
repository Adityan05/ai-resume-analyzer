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
      <body className="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="h-[12vh] min-h-[64px]">
            <Navbar />
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

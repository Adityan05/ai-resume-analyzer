import SignInComponent from "@/components/SignInComponent";

export const metadata = {
  title: "Sign In - AI Resume Analyzer",
  description: "Sign in to access your resume analysis dashboard",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <SignInComponent />
    </div>
  );
}

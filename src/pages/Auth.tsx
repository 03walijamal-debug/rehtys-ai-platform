import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function AuthPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1120] px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-widest text-white">
          REH<span className="text-[#8B5CF6]">T</span>YS
        </h1>
      </div>

      {/* Clerk SignIn Component */}
      <div className="w-full max-w-md">
        <SignIn
          routing="path"
          path="/auth"
          signUpUrl="/auth"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/onboarding"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white/5 border border-white/10 shadow-2xl",
            },
          }}
        />
      </div>
    </div>
  );
}

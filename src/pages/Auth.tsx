import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1120] px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-widest text-white">
          REH<span className="text-[#8B5CF6]">T</span>YS
        </h1>
      </div>

      <div className="w-full max-w-md">
        {!isSignUp ? (
          <SignIn
            routing="hash"
            signUpUrl="#/sign-up"
            afterSignInUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white/5 border border-white/10 shadow-2xl",
              },
            }}
          />
        ) : (
          <SignUp
            routing="hash"
            signInUrl="#/sign-in"
            afterSignUpUrl="/onboarding"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white/5 border border-white/10 shadow-2xl",
              },
            }}
          />
        )}
      </div>

      {/* Toggle Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-[#8B5CF6] hover:underline text-sm cursor-pointer"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

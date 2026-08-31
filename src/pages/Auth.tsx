import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

export default function AuthPage({ redirectAfterAuth = "/dashboard" }: AuthProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0B1A]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#8C7AE6]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#2C2A72]/8 rounded-full blur-3xl" />
      </div>
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="flex items-center justify-center h-full flex-col">
          <button onClick={() => navigate("/")} className="mb-8">
            <span className="text-2xl font-bold tracking-[0.12em] text-[#D9DCE3] font-['Space_Grotesk']">
              REH<span className="text-[#8C7AE6]">TY</span>S
            </span>
          </button>
          <div className="min-w-[380px]">
            <SignIn
              routing="path"
              path="/auth"
              signUpUrl="/auth"
              redirectUrl={redirectAfterAuth}
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "bg-[#13112A] border border-[#1E1B3A] shadow-2xl shadow-black/40",
                  headerTitle: "text-[#D9DCE3]",
                  headerSubtitle: "text-[#9CA3AF]",
                  formFieldLabel: "text-[#9CA3AF]",
                  formFieldInput: "bg-white/5 border-[#1E1B3A] text-[#D9DCE3]",
                  formButtonPrimary: "bg-[#8C7AE6] hover:bg-[#7B6AE6] text-white",
                  socialButtonsBlockButton: "border-[#1E1B3A] text-[#9CA3AF]",
                  footerActionLink: "text-[#8C7AE6]",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

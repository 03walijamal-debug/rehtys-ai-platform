"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-8xl font-bold font-['Space_Grotesk'] gradient-text mb-4">404</p>
        <h1 className="text-xl font-semibold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <Button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#0B1120] font-semibold"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
}

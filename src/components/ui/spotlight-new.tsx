"use client";

import React from "react";
import { motion } from "framer-motion";

interface SpotlightProps {
  className?: string;
}

export function Spotlight({ className }: SpotlightProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${
        className ?? ""
      }`}
    >
      {/* Spotlight beam 1 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute -top-40 -left-40 w-[50rem] h-[50rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(44,42,114,0.15) 0%, transparent 60%)",
        }}
      />
      {/* Spotlight beam 2 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.6 }}
        className="absolute -top-20 -right-40 w-[40rem] h-[40rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(140,122,230,0.1) 0%, transparent 60%)",
        }}
      />
      {/* Spotlight beam 3 — bottom center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.9 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(44,42,114,0.08) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add classes after mount to avoid hydration mismatch
    document.documentElement.classList.add("bg-background");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
} 
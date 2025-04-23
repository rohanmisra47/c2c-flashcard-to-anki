"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface FlashCardProps {
  question: string;
  answer: string;
}

export function FlashCard({ question, answer }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-[250px] w-full perspective-1000 group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer",
          isFlipped ? 'rotate-y-180' : ''
        )}
      >
        {/* Front of card */}
        <Card className="absolute w-full h-full p-6 backface-hidden bg-card hover:bg-accent/5 transition-colors">
          <div className="relative h-full">
            <div className="absolute inset-0 pointer-events-none shine-effect" />
            <div className="font-medium text-lg text-primary">Q: {question}</div>
          </div>
        </Card>

        {/* Back of card */}
        <Card className="absolute w-full h-full p-6 backface-hidden rotate-y-180 bg-card hover:bg-accent/5 transition-colors">
          <div className="relative h-full">
            <div className="absolute inset-0 pointer-events-none shine-effect" />
            <div className="text-muted-foreground">A: {answer}</div>
          </div>
        </Card>
      </div>
    </div>
  );
} 
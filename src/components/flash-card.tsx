"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { BookmarkIcon } from "lucide-react";
import { Button } from "./ui/button";

interface FlashCardProps {
  question: string;
  answer: string;
  onSave?: () => void;
}

export function FlashCard({ question, answer, onSave }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping when clicking save
    if (onSave) {
      onSave();
      setIsSaved(true);
    }
  };

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
            <div className="flex justify-between items-start">
              <div className="font-medium text-lg text-primary pr-8">Q: {question}</div>
              <Button
                size="icon"
                variant={isSaved ? "default" : "outline"}
                className="shrink-0 z-10"
                onClick={handleSave}
              >
                <BookmarkIcon className={cn(
                  "h-4 w-4",
                  isSaved ? "fill-primary-foreground" : "fill-none"
                )} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Back of card */}
        <Card className="absolute w-full h-full p-6 backface-hidden rotate-y-180 bg-card hover:bg-accent/5 transition-colors">
          <div className="relative h-full">
            <div className="absolute inset-0 pointer-events-none shine-effect" />
            <div className="flex justify-between items-start">
              <div className="text-muted-foreground pr-8">A: {answer}</div>
              <Button
                size="icon"
                variant={isSaved ? "default" : "outline"}
                className="shrink-0 z-10"
                onClick={handleSave}
              >
                <BookmarkIcon className={cn(
                  "h-4 w-4",
                  isSaved ? "fill-primary-foreground" : "fill-none"
                )} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 
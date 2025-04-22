"use client";

import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export function TextInput() {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    // TODO: Implement flashcard generation
    console.log("Generating flashcards for:", text);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Paste Medical Text</h2>
      <Textarea
        placeholder="Paste your medical text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[200px]"
      />
      <Button onClick={handleSubmit} className="w-full">
        Generate Flashcards
      </Button>
    </div>
  );
}

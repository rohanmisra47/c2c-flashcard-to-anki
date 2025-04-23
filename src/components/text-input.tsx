"use client";

import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { FlashCard } from "./flash-card";
import { Download, Save } from "lucide-react";

interface Flashcard {
  question: string;
  answer: string;
}

export function TextInput() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [totalChunks, setTotalChunks] = useState<number>(0);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Please enter some text to generate flashcards.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    const estimatedChunks = Math.ceil(text.length / 3000);
    setTotalChunks(estimatedChunks);
    setProgress(`Processing text in ${estimatedChunks} chunks...`);
    setFlashcards([]);
    
    try {
      const startTime = Date.now();
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate flashcards");
      }

      const endTime = Date.now();
      const processingTime = ((endTime - startTime) / 1000).toFixed(1);
      
      setFlashcards(data);
      setProgress(`Generated ${data.length} flashcards in ${processingTime} seconds`);
      
      setTimeout(() => setProgress(""), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to generate flashcards. Please try again.");
      console.error("Error generating flashcards:", err);
      setProgress("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    const flashcardsText = flashcards
      .map(card => `Q: ${card.question}\nA: ${card.answer}\n\n`)
      .join('');
    
    const blob = new Blob([flashcardsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportAnki = () => {
    const ankiFormat = flashcards
      .map(card => `${card.question}\t${card.answer}`)
      .join('\n');
    
    const blob = new Blob([ankiFormat], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'anki_flashcards.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border/50">
        <h2 className="text-2xl font-bold mb-4 text-primary">Create Flashcards</h2>
        <Textarea
          placeholder="Paste your medical text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[200px] bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/20"
        />
        <div className="flex gap-4 mt-4">
          <Button 
            onClick={handleSubmit} 
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isGenerating || !text.trim()}
          >
            {isGenerating ? `Generating... (${totalChunks} chunks)` : "Generate Flashcards"}
          </Button>
          {flashcards.length > 0 && (
            <>
              <Button
                onClick={handleSave}
                variant="outline"
                className="gap-2 border-border/50 hover:bg-accent"
              >
                <Save className="w-4 h-4" />
                Save as Text
              </Button>
              <Button
                onClick={handleExportAnki}
                variant="outline"
                className="gap-2 border-border/50 hover:bg-accent"
              >
                <Download className="w-4 h-4" />
                Export for Anki
              </Button>
            </>
          )}
        </div>
      </div>

      {progress && (
        <div className="bg-primary/10 text-primary rounded-lg p-4 animate-fadeIn">
          {progress}
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-4 animate-fadeIn">
          {error}
        </div>
      )}

      {flashcards.length > 0 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-primary">
              Generated Flashcards ({flashcards.length})
            </h3>
            <p className="text-sm text-muted-foreground">
              Click on a card to flip it
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flashcards.map((flashcard, index) => (
              <FlashCard
                key={index}
                question={flashcard.question}
                answer={flashcard.answer}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

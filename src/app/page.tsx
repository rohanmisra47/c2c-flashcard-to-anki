import { TextInput } from "@/components/text-input";

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Medical Flashcard Generator
        </h1>
        <TextInput />
      </div>
    </main>
  );
}

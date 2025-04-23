import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function generateFlashcards(text: string): Promise<{ question: string; answer: string }[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a medical education expert. Create flashcards from the given medical text.
          Each flashcard should have a clear, concise question and a detailed answer.
          Format the response as a JSON array of objects with 'question' and 'answer' properties.
          Focus on key concepts, definitions, and important details.`
        },
        {
          role: "user",
          content: `Create 3-5 flashcards from this medical text: ${text}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    if (!response) throw new Error("No response from OpenAI");

    const parsedResponse = JSON.parse(response);
    return parsedResponse.flashcards || [];
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
} 
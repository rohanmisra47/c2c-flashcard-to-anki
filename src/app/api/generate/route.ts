import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Function to split text into chunks
function splitTextIntoChunks(text: string, maxChunkLength: number = 2000): string[] {
  // Split by double newlines first to preserve paragraph structure
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    // If paragraph itself is too long, split it by sentences
    if (paragraph.length > maxChunkLength) {
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [];
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxChunkLength) {
          if (currentChunk) {
            chunks.push(currentChunk.trim());
          }
          currentChunk = sentence;
        } else {
          currentChunk += " " + sentence;
        }
      }
    } else {
      // If adding this paragraph would exceed limit, start new chunk
      if ((currentChunk + paragraph).length > maxChunkLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = paragraph;
      } else {
        currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  // Filter out chunks that are too short
  return chunks.filter(chunk => chunk.length > 50);
}

// Function to determine if text is complex (requires GPT-4)
function isComplexMedicalText(text: string): boolean {
  const complexIndicators = [
    /differential diagnosis/i,
    /pathophysiology/i,
    /mechanism of action/i,
    /clinical correlation/i,
    /diagnostic criteria/i,
    /treatment algorithm/i,
    /clinical manifestations/i,
    /therapeutic approach/i
  ];
  
  return complexIndicators.some(pattern => pattern.test(text));
}

// Process a single chunk
async function processChunk(chunk: string, index: number): Promise<any[]> {
  try {
    const model = isComplexMedicalText(chunk) ? "gpt-3.5-turbo" : "gpt-3.5-turbo";
    console.log(`Processing chunk ${index} with model ${model}`);
    
    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.7,
      max_tokens: 2500,
      messages: [
        {
          role: "system",
          content: `You are a medical education expert creating flashcards for a final year medical student. 
          Create comprehensive flashcards from the given medical text.
          
          For each concept in the text, create multiple flashcards that cover different aspects:
          1. Definition and basic concepts
          2. Clinical features and presentations
          3. Diagnostic criteria and investigations
          4. Management principles and treatment options
          5. Complications and prognosis
          6. Key differentials and related conditions
          
          Each flashcard should:
          - Have a clear, focused question
          - Provide a comprehensive but concise answer
          - Be self-contained and make sense on its own
          - Cover a single concept or aspect
          
          Create 5-8 flashcards from this text segment, ensuring comprehensive coverage.
          
          Format your response as a JSON array of objects with 'question' and 'answer' properties.`
        },
        {
          role: "user",
          content: `Create detailed medical flashcards from this text segment:\n\n${chunk}`
        }
      ]
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      console.error("Empty response from OpenAI for chunk", index);
      return [];
    }

    try {
      const parsedResponse = JSON.parse(response);
      if (!Array.isArray(parsedResponse)) {
        console.error("Invalid response format (not an array) from OpenAI for chunk", index);
        return [];
      }
      return parsedResponse;
    } catch (parseError) {
      // If parsing fails, try to extract flashcards from a different format
      console.error("Failed to parse JSON, attempting to extract flashcards from text", index);
      try {
        // Try to match question-answer pairs in the text
        const matches = response.match(/("question":\s*"[^"]+"\s*,\s*"answer":\s*"[^"]+")/g);
        if (matches) {
          const extractedFlashcards = matches.map(match => {
            const parsed = JSON.parse(`{${match}}`);
            return {
              question: parsed.question,
              answer: parsed.answer
            };
          });
          return extractedFlashcards;
        }
      } catch (e) {
        console.error("Failed to extract flashcards from text response", index);
      }
      return [];
    }
  } catch (error) {
    console.error(`Error processing chunk ${index}:`, error);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please check your environment variables." },
        { status: 500 }
      );
    }

    const chunks = splitTextIntoChunks(body.text);
    console.log(`Split text into ${chunks.length} chunks`);
    
    // Process chunks in parallel with a limit of 3 concurrent requests
    const batchSize = 3;
    let allFlashcards: any[] = [];
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(chunks.length / batchSize)}`);
      
      const batchResults = await Promise.all(
        batch.map((chunk, index) => processChunk(chunk, i + index))
      );
      
      allFlashcards = [...allFlashcards, ...batchResults.flat()];
    }

    if (allFlashcards.length === 0) {
      console.error("No flashcards were generated from any chunks");
      return NextResponse.json(
        { error: "Failed to generate flashcards. Please try again with different text." },
        { status: 500 }
      );
    }

    // Remove any duplicate flashcards
    const uniqueFlashcards = allFlashcards.filter((card, index, self) =>
      index === self.findIndex((c) => 
        c.question.toLowerCase() === card.question.toLowerCase()
      )
    );

    console.log(`Successfully generated ${uniqueFlashcards.length} unique flashcards`);
    return NextResponse.json(uniqueFlashcards);
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
} 
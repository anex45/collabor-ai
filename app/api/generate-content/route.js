import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    // Authenticate the user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize Google GenAI with explicit API key
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    // Get the request body
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Create the prompt for document generation
    const promptText = `You are a document generator AI. Based on the given document title, you need to generate document in rich text editor format in JSON. The output response should have "time" :"current timestamp", "blocks":[{"id":"unique_id","type":"header","data":{"text":"title text","level":1}},{"id":"unique_id2","type":"paragraph","data":{"text":"type_paragraph_here"}}], "version" : "2.29.1"

Generate a document for: ${message}

Please provide only the JSON response without any markdown formatting or code blocks.`;

    // Generate content using Gemini 2.5 Flash according to official documentation
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking for faster response and lower cost
        },
      }
    });

    return NextResponse.json({ 
      success: true, 
      content: response.text 
    });

  } catch (error) {
    console.error('Detailed error generating content:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: "Failed to generate content", 
        details: error.message,
        type: error.name 
      }, 
      { status: 500 }
    );
  }
}
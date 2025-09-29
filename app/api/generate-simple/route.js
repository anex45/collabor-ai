import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log('API Key available:', !!process.env.GEMINI_API_KEY);
    
    // Initialize Google GenAI
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    // Get the request body
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Simple prompt for testing
    const promptText = `Generate a simple document outline for: ${message}`;

    // Generate content using Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: promptText,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      }
    });

    return NextResponse.json({ 
      success: true, 
      content: response.text 
    });

  } catch (error) {
    console.error('Detailed API error:', {
      name: error.name,
      message: error.message,
      status: error.status,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: "Failed to generate content", 
        details: error.message,
        status: error.status || 'unknown'
      }, 
      { status: 500 }
    );
  }
}
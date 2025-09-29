import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize Google GenAI - API key will be picked up automatically from GEMINI_API_KEY environment variable
const ai = new GoogleGenAI({});

export async function GET(request) {
  try {
    console.log('Testing API route...');
    console.log('GEMINI_API_KEY available:', !!process.env.GEMINI_API_KEY);
    
    // Simple test without authentication
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say hello",
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      }
    });

    return NextResponse.json({ 
      success: true, 
      content: response.text,
      envPresent: !!process.env.GEMINI_API_KEY
    });

  } catch (error) {
    console.error('API route test failed:', error);
    return NextResponse.json(
      { 
        error: "Test failed", 
        message: error.message,
        envPresent: !!process.env.GEMINI_API_KEY
      }, 
      { status: 500 }
    );
  }
}
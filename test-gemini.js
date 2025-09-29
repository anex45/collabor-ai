// Test script to verify Gemini API works
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config({ path: '.env.local' });

console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say hello in JSON format",
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      }
    });
    
    console.log('Response:', response.text);
    console.log('API test successful!');
  } catch (error) {
    console.error('API test failed:', error);
    console.error('Error details:', error.message);
  }
}

testGemini();
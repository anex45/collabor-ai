// Backend test for Gemini API
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config({ path: '.env.local' });

console.log('=== Gemini API Backend Test ===\n');

// Check if API key is available
console.log('1. Environment Check:');
console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Present' : '❌ Missing');
console.log('   API Key length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
console.log('   API Key preview:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.slice(0, 10)}...` : 'N/A');

if (!process.env.GEMINI_API_KEY) {
  console.error('\n❌ GEMINI_API_KEY not found in environment variables');
  process.exit(1);
}

// Initialize Gemini AI
console.log('\n2. Initializing Gemini AI...');
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
console.log('   ✅ GoogleGenAI client initialized');

// Test function
async function testGeminiAPI() {
  console.log('\n3. Testing Gemini API...');
  
  try {
    // Test 1: Simple text generation
    console.log('   → Test 1: Simple text generation');
    const response1 = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello, respond with 'API is working!'",
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disable thinking for speed
        },
      }
    });
    
    console.log('   ✅ Test 1 Response:', response1.text);
    
    // Test 2: JSON generation (like the actual use case)
    console.log('\n   → Test 2: JSON document generation');
    const documentPrompt = `Generate a simple JSON document for a "Meeting Notes" title in this format:
{
  "time": "current_timestamp",
  "blocks": [
    {"id": "1", "type": "header", "data": {"text": "Meeting Notes", "level": 1}},
    {"id": "2", "type": "paragraph", "data": {"text": "Sample meeting notes content"}}
  ],
  "version": "2.29.1"
}

Respond only with valid JSON, no markdown formatting.`;

    const response2 = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: documentPrompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      }
    });
    
    console.log('   ✅ Test 2 Response:');
    console.log('   ', response2.text);
    
    // Test 3: Validate JSON response
    console.log('\n   → Test 3: JSON validation');
    try {
      const jsonResponse = JSON.parse(response2.text);
      console.log('   ✅ JSON is valid');
      console.log('   ✅ Has blocks array:', Array.isArray(jsonResponse.blocks));
      console.log('   ✅ Block count:', jsonResponse.blocks ? jsonResponse.blocks.length : 0);
    } catch (jsonError) {
      console.log('   ⚠️  JSON parsing failed:', jsonError.message);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Gemini API is working correctly');
    
  } catch (error) {
    console.error('\n❌ Gemini API Error:');
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);
    console.error('   Error status:', error.status || 'No status');
    console.error('   Error code:', error.code || 'No code');
    
    if (error.status === 503) {
      console.error('\n💡 Troubleshooting:');
      console.error('   - Status 503 means service temporarily unavailable');
      console.error('   - This is likely a temporary issue on Google\'s side');
      console.error('   - Try again in a few minutes');
      console.error('   - Check Google Cloud Status: https://status.cloud.google.com/');
    } else if (error.status === 401) {
      console.error('\n💡 Troubleshooting:');
      console.error('   - Status 401 means authentication failed');
      console.error('   - Check if your API key is valid');
      console.error('   - Verify the API key in Google AI Studio');
    } else if (error.status === 429) {
      console.error('\n💡 Troubleshooting:');
      console.error('   - Status 429 means rate limit exceeded');
      console.error('   - Wait a few minutes before trying again');
      console.error('   - Consider upgrading your API quota');
    }
    
    process.exit(1);
  }
}

// Run the test
console.log('\n4. Running API Tests...');
testGeminiAPI();
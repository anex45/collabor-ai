
// Client-side API wrapper for server-side Gemini AI integration
// This ensures the API key is never exposed to the client

// Function to generate content via server-side API
export const generateContent = async (message) => {
  try {
    const response = await fetch('/api/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate content');
    }

    return data.content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

// Legacy support for existing chatSession usage
export const chatSession = {
  sendMessage: async (message) => {
    return {
      response: {
        text: async () => await generateContent(message)
      }
    };
  }
};

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';

// Initialize with your API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateAISummary({ repoData, readmeContent, contributors }) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-pro",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });
    
    const prompt = `Analyze this GitHub repository and provide the following information in valid JSON format:
    
    {
      "summary": "concise summary of the project's purpose (1-2 paragraphs)",
      "features": ["array", "of", "key", "features"],
      "useCases": ["array", "of", "use", "cases"],
      "stats": {
        "notableStatistics": "text description"
      }
    }
    
    Repository: ${repoData.full_name}
    ${repoData.description ? `Description: ${repoData.description}` : ''}
    ${readmeContent ? `Readme Content: ${readmeContent.substring(0, 30000)}` : ''}
    `;
    
    // Use generateContent with proper configuration
    const result = await model.generateContent({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    });
    
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse response
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
    
  } catch (error) {
    console.error('Gemini API error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.text()
    });
    throw new Error('Failed to generate AI summary: ' + error.message);
  }
}
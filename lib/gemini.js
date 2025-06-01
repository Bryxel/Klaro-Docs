export async function analyzeDocument(text) {
    console.log('Sending text to Gemini API:', text.substring(0, 100) + '...');
    
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key available:', !!apiKey); // Log whether API key exists without exposing it
    
    if (!apiKey) {
        console.error('Environment variables:', process.env);
        throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: `You are an AI reviewer for documents like resumes, cover letters, essays, or assignments.
Your task is to analyze the following text and provide a detailed review.

IMPORTANT: You must respond with ONLY a valid JSON object in this exact format:
{
  "score": number (0-100),
  "summary": string,
  "suggestions": [string, string, ...]
}

Do not include any other text, explanations, or formatting. The response must be a single valid JSON object.

Document to analyze:
${text}`
                        }
                    ]
                }
            ]
        }),
    });
    
    const data = await response.json();
    console.log('Raw API response:', data);
    
    if (data.error) {
        console.error('API Error details:', data.error);
        throw new Error(`API Error: ${data.error.message}`);
    }
    
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log('Extracted text from response:', rawText);

    try {
        // Clean the response text by removing markdown code block formatting
        const cleanText = rawText.replace(/```json\n?|\n?```/g, '').trim();
        console.log('Cleaned text:', cleanText);
        
        // Try to parse the response as JSON
        const result = JSON.parse(cleanText);
        console.log('Parsed JSON result:', result);
        
        // Validate the result has the required fields
        if (!result || typeof result !== 'object') {
            throw new Error('Invalid response format');
        }

        // Ensure all required fields exist with proper types
        const formattedResult = {
            score: typeof result.score === 'number' ? result.score : 0,
            summary: typeof result.summary === 'string' ? result.summary : 'No summary available',
            suggestions: Array.isArray(result.suggestions) ? result.suggestions : ['No suggestions available']
        };
        
        console.log('Final formatted result:', formattedResult);
        return formattedResult;
    } catch (error) {
        console.error('Error parsing Gemini response:', error);
        console.error('Raw response text:', rawText);
        
        // Return a default response if parsing fails
        return {
            score: 0,
            summary: "Error analyzing document. Please try again.",
            suggestions: ["The document could not be analyzed properly. Please ensure it contains readable text."]
        };
    }
}
// app/api/analyze/route.js
import { analyzeDocument } from "@/lib/gemini";
import { readFile, writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { checkRateLimit } from "@/lib/rateLimiter";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  let tempPath = null;
  
  try {
    // Get IP address and check rate limit
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(ip);
    
    if (!rateLimit.allowed) {
      const resetTime = new Date(rateLimit.resetTime).toLocaleString();
      return new Response(JSON.stringify({ 
        error: `You've reached the daily limit of 3 attempts. Please try again after ${resetTime}`,
        remaining: 0
      }), { 
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log('Starting PDF analysis...');
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      console.log('No file uploaded');
      return new Response(JSON.stringify({ error: "No file uploaded" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log('File received:', file.name, 'Type:', file.type);
    if (!file.type?.includes('pdf')) {
      console.log('Invalid file type:', file.type);
      return new Response(JSON.stringify({ error: "File must be a PDF" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Create a temporary file
    console.log('Creating temporary file...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    tempPath = join(tmpdir(), `upload-${Date.now()}.pdf`);
    await writeFile(tempPath, buffer);
    console.log('Temporary file created at:', tempPath);

    try {
      // Parse the PDF
      console.log('Parsing PDF...');
      const pdfParse = (await import('pdf-parse')).default;
      const parsed = await pdfParse(buffer);
      const text = parsed.text;
      console.log('PDF parsed successfully, text length:', text.length);

      if (!text || text.trim().length === 0) {
        console.log('No text extracted from PDF');
        return new Response(JSON.stringify({ error: "Could not extract text from PDF" }), { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      console.log('Analyzing document...');
      const result = await analyzeDocument(text);
      console.log('Analysis complete:', result);

      // Validate the result format
      if (!result || typeof result !== 'object') {
        console.error('Invalid analysis result:', result);
        throw new Error('Invalid response from analysis service');
      }

      // Ensure the result has the required fields with default values if missing
      const formattedResult = {
        score: result.score || 0,
        summary: result.summary || 'No summary available',
        suggestions: Array.isArray(result.suggestions) ? result.suggestions : ['No suggestions available'],
        remaining: rateLimit.remaining
      };

      console.log('Sending formatted result:', formattedResult);
      return new Response(JSON.stringify(formattedResult), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } finally {
      // Clean up the temporary file
      if (tempPath) {
        try {
          console.log('Cleaning up temporary file...');
          await unlink(tempPath);
          console.log('Temporary file cleaned up');
        } catch (e) {
          console.error('Error cleaning up temporary file:', e);
        }
      }
    }
  } catch (error) {
    console.error('Error in PDF processing:', error);
    return new Response(JSON.stringify({ 
      error: error.message || "Error processing PDF file"
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

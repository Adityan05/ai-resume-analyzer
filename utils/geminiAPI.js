import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini API integration for language and improvement suggestions
 */

/**
 * Call Gemini API for resume improvement suggestions using direct REST API
 * @param {Object} resumeData - Structured resume data
 * @returns {Promise<Object>} Gemini analysis results
 */
export async function analyzeWithGemini(resumeData) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key not found in environment variables");
  }

  const prompt = `You are an expert resume writing assistant.
First, determine if this document appears to be a resume/CV or if it's a random document.

If it IS a resume, provide detailed feedback and rewrites:
- Identify weak or missing sections.
- Suggest rewritten, professional sentences for Experience and Projects.
- Give concise improvement tips for each section.

If it's NOT a resume, provide a helpful message explaining what was uploaded instead.

Output in strict JSON with:
{
  "is_resume": boolean,
  "improvements": {
    "Education": "specific suggestion for education section",
    "Experience": "specific suggestion for experience section", 
    "Projects": "specific suggestion for projects section",
    "Skills": "specific suggestion for skills section"
  },
  "rewrites": {
    "Experience": "rewritten professional version of experience section",
    "Projects": "rewritten professional version of projects section"
  },
  "non_resume_message": "message to show if this is not a resume (only include if is_resume is false)"
}

Document JSON:
${JSON.stringify(resumeData, null, 2)}`;

  try {
    // Try the GoogleGenerativeAI SDK first
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text().trim();

    // Try to parse JSON response
    try {
      const parsedResult = JSON.parse(content);

      // Validate the structure
      if (
        typeof parsedResult.is_resume !== "boolean" ||
        !parsedResult.improvements ||
        !parsedResult.rewrites
      ) {
        throw new Error("Invalid response structure from Gemini API");
      }

      return parsedResult;
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResult = JSON.parse(jsonMatch[0]);
        return parsedResult;
      }

      throw new Error(
        `Failed to parse Gemini response as JSON: ${parseError.message}`
      );
    }
  } catch (error) {
    // If SDK fails, try direct REST API
    if (error.message.includes("404") || error.message.includes("not found")) {
      console.log("SDK failed, trying direct REST API...");
      return await analyzeWithGeminiDirectAPI(resumeData, prompt, apiKey);
    }

    if (error.message.includes("API key")) {
      throw error;
    }
    throw new Error(`Gemini API call failed: ${error.message}`);
  }
}

/**
 * Fallback: Direct REST API call to Gemini
 */
async function analyzeWithGeminiDirectAPI(resumeData, prompt, apiKey) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Gemini REST API error: ${response.status} - ${errorData}`
      );
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      throw new Error("Invalid response structure from Gemini REST API");
    }

    const content = data.candidates[0].content.parts[0].text.trim();

    // Try to parse JSON response
    try {
      const parsedResult = JSON.parse(content);

      // Validate the structure
      if (
        typeof parsedResult.is_resume !== "boolean" ||
        !parsedResult.improvements ||
        !parsedResult.rewrites
      ) {
        throw new Error("Invalid response structure from Gemini API");
      }

      return parsedResult;
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResult = JSON.parse(jsonMatch[0]);
        return parsedResult;
      }

      throw new Error(
        `Failed to parse Gemini response as JSON: ${parseError.message}`
      );
    }
  } catch (error) {
    throw new Error(`Gemini REST API call failed: ${error.message}`);
  }
}

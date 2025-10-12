/**
 * DeepSeek API integration for structural and scoring analysis
 */

const DEEPSEEK_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Call DeepSeek API for resume structural analysis
 * @param {Object} resumeData - Structured resume data
 * @returns {Promise<Object>} DeepSeek analysis results
 */
export async function analyzeWithDeepSeek(resumeData) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("DeepSeek API key not found in environment variables");
  }

  const prompt = `You are a professional resume evaluator.
First, determine if this document appears to be a resume/CV or if it's a random document.

Analyze the following document JSON for structure and quality.
Rate each of the following categories from 0-10:
- Section completeness (how well each section is filled out)
- Skill relevance (how relevant the skills are to modern job market)
- Keyword richness (presence of industry-relevant keywords)
- Grammar accuracy (grammatical correctness and professional language)

Provide your output in **strict JSON only** with the structure:
{
  "is_resume": boolean,
  "structure_score": number,
  "skills_score": number,
  "keywords_score": number,
  "grammar_score": number,
  "overall_score_100": number,
  "comments": ["short bullet comment 1", "short bullet comment 2", "short bullet comment 3"]
}

Rules:
- If the document is clearly NOT a resume (e.g., random text, academic paper, etc.), set "is_resume" to false and provide appropriate comments
- If it IS a resume, set "is_resume" to true
- "overall_score_100" should be calculated as: (structure_score + skills_score + keywords_score + grammar_score) * 2.5 (to convert from 40 max to 100 max)
- Individual scores remain 0-10 scale

Document JSON:
${JSON.stringify(resumeData, null, 2)}`;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "AI Resume Analyzer",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from DeepSeek API");
    }

    const content = data.choices[0].message.content.trim();

    // Try to parse JSON response
    try {
      const parsedResult = JSON.parse(content);

      // Validate the structure
      if (
        typeof parsedResult.is_resume !== "boolean" ||
        !parsedResult.structure_score ||
        !parsedResult.skills_score ||
        !parsedResult.keywords_score ||
        !parsedResult.grammar_score ||
        !parsedResult.overall_score_100
      ) {
        throw new Error("Invalid response structure from DeepSeek API");
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
        `Failed to parse DeepSeek response as JSON: ${parseError.message}`
      );
    }
  } catch (error) {
    if (error.message.includes("API key")) {
      throw error;
    }
    throw new Error(`DeepSeek API call failed: ${error.message}`);
  }
}

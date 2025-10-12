/**
 * Aggregation layer to combine DeepSeek and Gemini results
 */

/**
 * Combine DeepSeek and Gemini analysis results into final report
 * @param {Object} deepseekResult - DeepSeek analysis results
 * @param {Object} geminiResult - Gemini analysis results
 * @returns {Object} Final aggregated report
 */
export function aggregateResults(deepseekResult, geminiResult) {
  // Check if both APIs agree this is a resume
  const isResume = deepseekResult.is_resume && geminiResult.is_resume;

  // Use the overall score from DeepSeek (already calculated as out of 100)
  const overallScore = deepseekResult.overall_score_100 || 0;

  // Create final report structure
  const finalReport = {
    summary: {
      overallScore: overallScore,
      scores: {
        structure: deepseekResult.structure_score,
        skills: deepseekResult.skills_score,
        keywords: deepseekResult.keywords_score,
        grammar: deepseekResult.grammar_score,
      },
      comments: deepseekResult.comments || [],
      isResume: isResume,
    },
    improvements: geminiResult.improvements || {},
    rewrites: geminiResult.rewrites || {},
    nonResumeMessage: geminiResult.non_resume_message || null,
    metadata: {
      analyzedAt: new Date().toISOString(),
      analysisVersion: "2.0",
    },
  };

  return finalReport;
}

/**
 * Validate analysis results before aggregation
 * @param {Object} deepseekResult - DeepSeek analysis results
 * @param {Object} geminiResult - Gemini analysis results
 * @returns {boolean} True if results are valid
 */
export function validateResults(deepseekResult, geminiResult) {
  // Validate DeepSeek result
  if (
    !deepseekResult ||
    typeof deepseekResult.is_resume !== "boolean" ||
    typeof deepseekResult.structure_score !== "number" ||
    typeof deepseekResult.skills_score !== "number" ||
    typeof deepseekResult.keywords_score !== "number" ||
    typeof deepseekResult.grammar_score !== "number" ||
    typeof deepseekResult.overall_score_100 !== "number"
  ) {
    return false;
  }

  // Validate Gemini result
  if (
    !geminiResult ||
    typeof geminiResult.is_resume !== "boolean" ||
    !geminiResult.improvements ||
    !geminiResult.rewrites
  ) {
    return false;
  }

  return true;
}

/**
 * Create error report when analysis fails
 * @param {string} errorMessage - Error message
 * @param {string} source - Source of error (deepseek, gemini, or general)
 * @returns {Object} Error report
 */
export function createErrorReport(errorMessage, source = "general") {
  return {
    error: {
      message: errorMessage,
      source: source,
      timestamp: new Date().toISOString(),
    },
    summary: {
      overallScore: 0,
      scores: {
        structure: 0,
        skills: 0,
        keywords: 0,
        grammar: 0,
      },
      comments: ["Analysis failed due to technical error"],
    },
    improvements: {},
    rewrites: {},
    metadata: {
      analyzedAt: new Date().toISOString(),
      analysisVersion: "1.0",
      status: "error",
    },
  };
}

import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/utils/fileExtraction";
import { parseResumeText, cleanResumeData } from "@/utils/resumeParser";
import { analyzeWithDeepSeek } from "@/utils/deepseekAPI";
import { analyzeWithGemini } from "@/utils/geminiAPI";
import { aggregateResults, validateResults } from "@/utils/aggregation";
import { createClient } from "@/utils/supabase/server";
import {
  hasSufficientCredits,
  deductUserCredits,
  recordUserScan,
} from "@/utils/supabase/database";

/**
 * POST /api/analyze - Analyze uploaded resume file
 */
export async function POST(request) {
  try {
    // Check authentication first
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const jobDescription = formData.get("jobDescription") || "";

    // Validate file upload
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check if user has sufficient credits
    const SCAN_COST = 50;
    const hasCredits = await hasSufficientCredits(user.id, SCAN_COST);

    if (!hasCredits) {
      return NextResponse.json(
        {
          error: "Insufficient credits. You need 50 credits to perform a scan.",
        },
        { status: 402 }
      ); // 402 Payment Required
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX files are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Step 1: Extract text from file
    console.log("Extracting text from file...", {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    let extractedText;
    try {
      extractedText = await extractTextFromFile(fileBuffer, file.type);
      console.log("Text extraction successful", {
        textLength: extractedText?.length || 0,
        preview: extractedText?.substring(0, 100) + "...",
      });
    } catch (extractionError) {
      console.error("Text extraction failed:", extractionError);
      return NextResponse.json(
        { error: `Text extraction failed: ${extractionError.message}` },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      console.error("No text extracted from file", {
        fileName: file.name,
        fileType: file.type,
        extractedText: extractedText,
      });
      return NextResponse.json(
        {
          error:
            "Could not extract text from the uploaded file. The file may be corrupted or contain only images.",
        },
        { status: 400 }
      );
    }

    // Step 2: Parse resume text into structured format
    console.log("Parsing resume text...");
    const parsedResume = parseResumeText(extractedText);
    const cleanedResume = cleanResumeData(parsedResume);

    // Add job description to resume data if provided
    if (jobDescription) {
      cleanedResume.jobDescription = jobDescription;
    }

    // Step 3: Analyze with both APIs in parallel
    console.log("Starting analysis with DeepSeek and Gemini...");

    let deepseekResult, geminiResult;

    try {
      // Run both analyses in parallel for better performance
      const [deepseekResponse, geminiResponse] = await Promise.allSettled([
        analyzeWithDeepSeek(cleanedResume),
        analyzeWithGemini(cleanedResume),
      ]);

      // Handle DeepSeek result
      if (deepseekResponse.status === "fulfilled") {
        deepseekResult = deepseekResponse.value;
      } else {
        console.error("DeepSeek analysis failed:", deepseekResponse.reason);
        throw new Error(
          `DeepSeek analysis failed: ${deepseekResponse.reason.message}`
        );
      }

      // Handle Gemini result
      if (geminiResponse.status === "fulfilled") {
        geminiResult = geminiResponse.value;
      } else {
        console.error("Gemini analysis failed:", geminiResponse.reason);
        throw new Error(
          `Gemini analysis failed: ${geminiResponse.reason.message}`
        );
      }
    } catch (apiError) {
      console.error("API analysis error:", apiError);
      return NextResponse.json({ error: apiError.message }, { status: 500 });
    }

    // Step 4: Validate results
    if (!validateResults(deepseekResult, geminiResult)) {
      return NextResponse.json(
        { error: "Invalid analysis results received from APIs" },
        { status: 500 }
      );
    }

    // Step 5: Aggregate results
    console.log("Aggregating results...");
    const finalReport = aggregateResults(deepseekResult, geminiResult);

    // Add original resume data for reference
    finalReport.resumeData = cleanedResume;

    // Step 6: Deduct credits and record scan
    try {
      await deductUserCredits(user.id, SCAN_COST);

      // Record the scan in user's history
      const fileType = file.type === "application/pdf" ? "PDF" : "DOCX";
      await recordUserScan(user.id, file.name, fileType);

      console.log(
        `Credits deducted: ${SCAN_COST}, Scan recorded for user: ${user.id}`
      );
    } catch (dbError) {
      console.error("Error updating user data:", dbError);
      // Don't fail the entire request if database operations fail
      // The analysis was successful, just the tracking failed
    }

    console.log("Analysis completed successfully");
    return NextResponse.json(finalReport);
  } catch (error) {
    console.error("Analysis error:", error);

    // Return appropriate error response
    if (error.message.includes("file type") || error.message.includes("size")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/analyze - Test endpoint for debugging
 */
export async function GET() {
  return NextResponse.json({
    message: "AI Resume Analyzer API is running",
    endpoints: {
      POST: "/api/analyze - Upload and analyze resume file",
      GET: "/api/analyze - API status check",
    },
    supportedFormats: ["PDF", "DOCX"],
    maxFileSize: "10MB",
    timestamp: new Date().toISOString(),
  });
}

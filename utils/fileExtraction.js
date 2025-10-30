/**
 * Extract text from PDF file
 * @param {Buffer} fileBuffer - PDF file buffer
 * @returns {Promise<string>} Extracted text
 */
export async function extractTextFromPDF(fileBuffer) {
  try {
    const pdfModule = await import("pdf-parse");
    // v1 of pdf-parse exposes a default export function
    const pdf = pdfModule.default || pdfModule.pdf || pdfModule;
    const data = await pdf(fileBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Extract text from DOCX file
 * @param {Buffer} fileBuffer - DOCX file buffer
 * @returns {Promise<string>} Extracted text
 */
export async function extractTextFromDOCX(fileBuffer) {
  try {
    const mammothModule = await import("mammoth");
    // mammoth exports functions directly
    const result = await mammothModule.extractRawText({ buffer: fileBuffer });
    return result.value;
  } catch (error) {
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
}

/**
 * Extract text from uploaded file based on file type
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} Extracted text
 */
export async function extractTextFromFile(fileBuffer, mimeType) {
  switch (mimeType) {
    case "application/pdf":
      return await extractTextFromPDF(fileBuffer);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return await extractTextFromDOCX(fileBuffer);
    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
}

export async function extractTextFromPDF(file) {
  // Simple fallback - for production use pdf-lib or pdf.js
  try {
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(buffer)
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Basic cleanup
      .substring(0, 50000); // Limit size
  } catch (err) {
    console.error('PDF extraction failed:', err);
    throw new Error('Could not read PDF');
  }
}
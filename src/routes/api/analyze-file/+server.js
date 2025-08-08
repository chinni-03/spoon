// src/routes/api/analyze-file/+server.js
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  console.log('[API] Received upload request'); // Debug log
  
  try {
    const formData = await request.formData();
    console.log('[API] FormData parsed successfully'); // Debug log
    
    const file = formData.get('file');
    console.log('[API] Received file:', { // Debug log
      name: file.name,
      type: file.type,
      size: file.size,
      isBlob: file instanceof Blob
    });

    if (!file || !(file instanceof Blob)) {
      console.log('[API] Invalid file upload'); // Debug log
      return json({ error: 'Invalid file upload' }, { status: 400 });
    }

    console.log('[API] Reading file content...'); // Debug log
    const content = await file.text();
    console.log('[API] Content length:', content.length); // Debug log

    const responseData = {
      success: true,
      type: 'document',
      fileName: file.name,
      size: file.size,
      content: content,
      preview: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
      stats: {
        size: file.size,
        lines: content.split('\n').length,
        words: content.split(/\s+/).length,
        sections: content.split(/\n## /).length - 1
      }
    };

    console.log('[API] Returning successful response'); // Debug log
    return json(responseData);

  } catch (error) {
    console.error('[API] Error:', error); // Debug log
    return json({ 
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}
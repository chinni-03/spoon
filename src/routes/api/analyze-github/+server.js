import { json } from '@sveltejs/kit';
import { extractRepoInfo } from '$lib/utils/github';
import { generateAISummary } from '$lib/server/ai-summary.js';

export async function POST({ request }) {
  try {
    const { url } = await request.json();
    const repoInfo = extractRepoInfo(url);
    
    if (!repoInfo) {
      return json({ error: 'Invalid GitHub URL' }, { status: 400 });
    }
    
    // Fetch repo data
    const repoResponse = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`);
    if (!repoResponse.ok) {
      const error = await repoResponse.json();
      return json({ error: error.message || 'GitHub API error' }, { status: repoResponse.status });
    }
    
    const repoData = await repoResponse.json();
    
    // Fetch README
    let readmeContent = '';
    try {
      const readmeResponse = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/readme`, {
        headers: { 'Accept': 'application/vnd.github.v3.raw' }
      });
      if (readmeResponse.ok) readmeContent = await readmeResponse.text();
    } catch (error) {
      console.error('README fetch error:', error);
    }
    
    // Generate AI summary
    const aiSummary = await generateAISummary({
      repoData,
      readmeContent,
      contributors: []
    });
    
    return json({
      type: 'github',
      repoData,
      aiSummary
    });
    
  } catch (error) {
    console.error('Server error:', error);
    return json({ 
      error: error.message || 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
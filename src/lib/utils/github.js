export function extractRepoInfo(url) {
  try {
    // Handle shorthand format (owner/repo)
    if (!url.includes('://') && url.split('/').length === 2) {
      const [owner, repo] = url.split('/');
      return { owner, repo };
    }

    // Add https:// if missing
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    // Remove trailing slashes and .git
    url = url.replace(/\/+$/, '').replace(/\.git$/, '');

    const parsed = new URL(url);
    
    if (!['github.com', 'www.github.com'].includes(parsed.hostname)) {
      return null;
    }

    const pathParts = parsed.pathname.split('/').filter(Boolean);
    
    if (pathParts.length < 2) {
      return null;
    }
    
    return {
      owner: pathParts[0],
      repo: pathParts[1]
    };
  } catch (error) {
    console.error('URL parsing error:', error);
    return null;
  }
}
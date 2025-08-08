// src/lib/utils/markdown.js
import { marked } from 'marked';

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true,
  mangle: false,
  headerIds: false
});

export async function parseMarkdown(markdown) {
  return marked.parse(markdown);
}
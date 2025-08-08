# Spoon - AI Document Analyzer

<img width="1891" height="937" alt="image" src="https://github.com/user-attachments/assets/363eb894-18c3-4a7b-be13-c161c99bd325" />

Spoon is a lightweight AI-powered tool that analyzes documents and GitHub repositories to extract key insights and technical information.

## ✨ Features

- **📄 File Analysis**  
  Supports PDF and Markdown documents with automatic content parsing
- **🐙 GitHub Integration**  
  Analyze public repositories by URL or `owner/repo` format
- **🔍 Smart Insights**  
  Extracts:
  - Key features and use cases
  - Technology stack identification
  - Project structure overview
  - Document statistics (word count, sections, etc.)
- **🎨 Clean Interface**  
  Intuitive tab-based navigation with responsive design

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/chinni-03/spoon.git
   cd spoon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open in your browser:
   ```text
   http://localhost:5173
   ```

## 📖 Usage Guide

### For Document Analysis
1. Select the "Upload File" tab
2. Choose a PDF or Markdown file
3. View automatically generated analysis

### For GitHub Analysis
1. Select the "GitHub Repo" tab
2. Enter repository URL (e.g., `https://github.com/owner/repo` or `owner/repo`)
3. Click "Analyze" to view insights

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [SvelteKit](https://kit.svelte.dev/) | Frontend framework |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS styling |
| [Marked.js](https://marked.js.org/) | Markdown parsing |
| [GitHub API](https://docs.github.com/en/rest) | Repository analysis |

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/chinni-03/spoon/blob/main/LICENSE) file for details.

---

**Maintained by** [Harshini Vijendra Kumar](https://github.com/chinni-03)

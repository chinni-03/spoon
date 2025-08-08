<script>
  import { marked } from "marked";
  import { onMount } from "svelte";

  export let data;

  // Initialize marked with GitHub-like settings
  marked.setOptions({
    gfm: true,
    breaks: true,
    smartypants: true,
  });

  let parsedContent = {
    title: "",
    description: "",
    badges: [],
    features: [],
    useCases: [],
    summary: "",
    technologies: [],
    installation: "",
    stats: {},
  };

  onMount(() => {
    if (data?.content) {
      parseMarkdownContent(data.content);
    }
  });

  function parseMarkdownContent(content) {
    try {
      // Extract title (first heading)
      const titleMatch = content.match(/^# (.+)/m);
      parsedContent.title = titleMatch?.[1]?.trim() || data.fileName;

      // Extract description (first paragraph after title)
      const descriptionMatch = content.match(/^# .+\n\n(.+?)(?=\n#|\n!|\n$)/s);
      parsedContent.description =
        descriptionMatch?.[1]?.trim() || "Document Analysis";

      // Extract badges
      const badgeRegex = /!\[(.*?)\]\((https:\/\/img\.shields\.io\/[^)]+)\)/g;
      let badgeMatch;
      while ((badgeMatch = badgeRegex.exec(content)) !== null) {
        parsedContent.badges.push({
          alt: badgeMatch[1],
          src: badgeMatch[2],
        });
      }

      // Extract features
      const featuresSection = content.match(
        /## ✨ Features\n([\s\S]+?)(?=\n##|$)/
      );
      if (featuresSection) {
        parsedContent.features = featuresSection[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.replace(/^- /, "").trim())
          .filter(Boolean);
      }

      // Extract use cases
      const useCasesSection = content.match(
        /## Use Cases\n([\s\S]+?)(?=\n##|$)/
      );
      if (useCasesSection) {
        parsedContent.useCases = useCasesSection[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.replace(/^- /, "").trim())
          .filter(Boolean);
      }

      // Extract technologies
      const techSection = content.match(
        /## 🛠️ Technology Stack\n([\s\S]+?)(?=\n##|$)/
      );
      if (techSection) {
        parsedContent.technologies = techSection[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.replace(/^- /, "").trim())
          .filter(Boolean);
      }

      // Extract installation
      const installSection = content.match(
        /## 🚀 Getting Started\n([\s\S]+?)(?=\n##|$)/
      );
      if (installSection) {
        parsedContent.installation = installSection[1];
      }

      // Extract summary from the first meaningful content
      parsedContent.summary =
        parsedContent.description ||
        content
          .split("\n")
          .find(
            (line) =>
              line.trim() && !line.startsWith("#") && !line.startsWith("![")
          ) ||
        "No summary available";

      // Set stats
      parsedContent.stats = data.stats || {};
    } catch (err) {
      console.error("Error parsing markdown:", err);
    }
  }

  function renderMarkdown(text) {
    if (!text) return "";
    try {
      return marked.parse(text);
    } catch (err) {
      console.error("Error rendering markdown:", err);
      return text;
    }
  }

  function formatFileSize(bytes) {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  }
</script>

<div class="mt-8 bg-white shadow rounded-lg overflow-hidden">
  {#if data.type === "github"}
    <!-- GitHub repo analysis display -->
    <div class="px-6 py-5 border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path
            fill-rule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clip-rule="evenodd"
          />
        </svg>
        {data.repoData.full_name}
      </h2>
      <p class="mt-1 text-gray-600">
        {data.repoData.description || "No description available"}
      </p>
    </div>

    <div class="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-3">Project Summary</h3>
        <p class="text-gray-700 whitespace-pre-line">
          {data.aiSummary?.summary || "No summary generated"}
        </p>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-3">Key Features</h3>
        <ul class="list-disc pl-5 space-y-1 text-gray-700">
          {#each data.aiSummary?.features || [] as feature}
            <li>{feature}</li>
          {/each}
        </ul>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-3">Use Cases</h3>
        <ul class="list-disc pl-5 space-y-1 text-gray-700">
          {#each data.aiSummary?.useCases || [] as useCase}
            <li>{useCase}</li>
          {/each}
        </ul>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-3">Project Stats</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Stars</p>
            <p class="text-xl font-semibold">
              {data.repoData.stargazers_count}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Forks</p>
            <p class="text-xl font-semibold">{data.repoData.forks_count}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Created</p>
            <p class="text-xl font-semibold">
              {formatDate(data.repoData.created_at)}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Last Updated</p>
            <p class="text-xl font-semibold">
              {formatDate(data.repoData.updated_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  {:else if data.type === "document"}
    <!-- Header Section -->
    <div class="px-6 py-5 border-b border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900">{parsedContent.title}</h2>
      {#if parsedContent.badges.length > 0}
        <div class="mt-2 flex flex-wrap gap-2">
          {#each parsedContent.badges as badge}
            <img src={badge.src} alt={badge.alt} class="h-6" />
          {/each}
        </div>
      {/if}
      <div class="mt-3 prose text-gray-600 max-w-none">
        {@html renderMarkdown(parsedContent.description)}
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Left Column -->
      <div>
        <div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Project Summary</h3>
          <div class="prose max-w-none text-gray-700">
            {@html renderMarkdown(parsedContent.summary)}
          </div>
        </div>

        {#if parsedContent.installation}
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Getting Started</h3>
            <div class="prose max-w-none text-gray-700">
              {@html renderMarkdown(parsedContent.installation)}
            </div>
          </div>
        {/if}
      </div>

      <!-- Right Column -->
      <div>
        {#if parsedContent.features.length > 0}
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
            <ul class="space-y-2">
              {#each parsedContent.features as feature}
                <li class="text-gray-700">
                  {@html renderMarkdown(feature)}
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if parsedContent.useCases.length > 0}
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Use Cases</h3>
            <ul class="space-y-2">
              {#each parsedContent.useCases as useCase}
                <li class="text-gray-700">
                  {@html renderMarkdown(useCase)}
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if parsedContent.technologies.length > 0}
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Technology Stack</h3>
            <ul class="space-y-2">
              {#each parsedContent.technologies as tech}
                <li class="text-gray-700">
                  {@html renderMarkdown(tech)}
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>

    <!-- Stats Section -->
    <div class="px-6 py-5 border-t border-gray-200 bg-gray-50">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Document Statistics</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p class="text-sm text-gray-500 font-medium">Words</p>
          <p class="text-xl font-bold text-gray-800">{parsedContent.stats.words?.toLocaleString() || "N/A"}</p>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p class="text-sm text-gray-500 font-medium">Lines</p>
          <p class="text-xl font-bold text-gray-800">{parsedContent.stats.lines?.toLocaleString() || "N/A"}</p>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p class="text-sm text-gray-500 font-medium">File Size</p>
          <p class="text-xl font-bold text-gray-800">{formatFileSize(parsedContent.stats.size)}</p>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p class="text-sm text-gray-500 font-medium">Sections</p>
          <p class="text-xl font-bold text-gray-800">{parsedContent.stats.sections || "N/A"}</p>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .prose {
    max-width: 100%;
    color: #374151;
    line-height: 1.6;
  }
</style>

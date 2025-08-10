<script>
  import { enhance } from "$app/forms";
  import { AnalysisResults, FileUpload, GithubInput } from "$lib/components";

  let activeTab = "github";
  let isLoading = false;
  let analysisData = null;
  let error = null;

  function handleTabSwitch(newTab) {
    if (activeTab !== newTab) {
      analysisData = null;
      error = null;
      activeTab = newTab;
    }
  }

  async function handleGithubAnalysis(event) {
    const url = event.detail.url;
    isLoading = true;
    error = null;

    try {
      const response = await fetch("/api/analyze-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to analyze repository");
      analysisData = data;
    } catch (err) {
      error = {
        message: err.message,
        details: "Please try another repository or check your API key",
      };
    } finally {
      isLoading = false;
    }
  }

  async function handleFileAnalysis(event) {
    isLoading = true;
    error = null;
    analysisData = null;

    try {
      const { file } = event.detail;
      const formData = new FormData();
      formData.append("file", file, file.name);

      const response = await fetch("/api/analyze-file", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }
      analysisData = await response.json();
    } catch (err) {
      error = {
        message: err.message,
        details: err.details || "Please try another file",
      };
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen">
  <!-- Hero Section -->
  <div
    class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-4xl mx-auto text-center">
      <div class="flex justify-center mb-6">
        <div class="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
          <svg
            class="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            ></path>
          </svg>
        </div>
      </div>
      <h1 class="text-4xl font-bold mb-4">Spoon AI Analyzer</h1>
      <p class="text-xl opacity-90 max-w-2xl mx-auto">
        Extract intelligent insights from documents and GitHub repositories
      </p>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-12">
    {#if error}
      <div
        class="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg shadow-sm backdrop-blur-sm"
      >
        <!-- Error display -->
      </div>
    {/if}

    <div
      class="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200/50"
    >
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="flex">
          <button
            class={`flex-1 py-5 px-6 text-center border-b-2 font-medium text-sm transition-all ${activeTab === "github" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            on:click={() => handleTabSwitch("github")}
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              GitHub Repo
            </span>
          </button>
          <button
            class={`flex-1 py-5 px-6 text-center border-b-2 font-medium text-sm transition-all ${activeTab === "file" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            on:click={() => handleTabSwitch("file")}
          >
            <span class="flex items-center justify-center gap-2">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Upload File
            </span>
          </button>
        </nav>
      </div>

      <!-- Content Area -->
      <div class="p-8">
        {#if activeTab === "github"}
          <GithubInput on:submit={handleGithubAnalysis} {isLoading} />
        {:else}
          <FileUpload on:submit={handleFileAnalysis} {isLoading} />
        {/if}
      </div>
    </div>

    {#if isLoading}
      <div
        class="mt-8 p-8 bg-white rounded-xl shadow-lg border border-gray-200/50 flex flex-col items-center"
      >
        <div class="animate-pulse flex flex-col items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-full mb-4"></div>
          <div class="h-4 bg-blue-100 rounded w-32"></div>
        </div>
      </div>
    {/if}

    {#if analysisData}
      <AnalysisResults data={analysisData} {isLoading} />
    {/if}
  </div>
</div>

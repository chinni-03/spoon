<!-- +page.svelte -->
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
      if (!response.ok) throw new Error(data.error || "Failed to analyze repository");
      analysisData = data;
    } catch (err) {
      error = { message: err.message, details: "Please try another repository or check your API key" };
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

      const response = await fetch("/api/analyze-file", { method: "POST", body: formData });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }
      analysisData = await response.json();
    } catch (err) {
      error = { message: err.message, details: err.details || "Please try another file" };
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Spoon</h1>
      <p class="text-xl text-gray-600 max-w-lg mx-auto">
        AI-powered insights for your codebases and documents
      </p>
    </div>

    {#if error}
      <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-lg shadow-sm">
        <div class="flex items-start gap-3">
          <svg class="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="text-sm font-medium text-red-700">{error.error || error.message}</p>
            {#if error.details}
              <p class="text-sm text-red-600 mt-1">{error.details}</p>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="border-b border-gray-200">
        <nav class="flex">
          <button
            class={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm hover:cursor-pointer ${activeTab === "github" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            on:click={() => handleTabSwitch("github")}
          >
            GitHub Repo
          </button>
          <button
            class={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm hover:cursor-pointer ${activeTab === "file" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            on:click={() => handleTabSwitch("file")}
          >
            Upload File
          </button>
        </nav>
      </div>

      <div class="p-6 sm:p-8">
        {#if activeTab === "github"}
          <GithubInput on:submit={handleGithubAnalysis} {isLoading} />
        {:else}
          <FileUpload on:submit={handleFileAnalysis} {isLoading} />
        {/if}
      </div>
    </div>

    {#if isLoading}
      <div class="mt-8 p-6 bg-white rounded-xl shadow-md flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600 font-medium">Analyzing content...</p>
      </div>
    {/if}

    {#if analysisData}
      <AnalysisResults data={analysisData} {isLoading} />
    {/if}
  </div>
</div>
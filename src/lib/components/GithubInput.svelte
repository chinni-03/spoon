<!-- GithubInput.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  
  export let isLoading = false;
  const dispatch = createEventDispatcher();
  let githubUrl = '';
  let error = null;

  function validateGitHubUrl(url) {
    if (!url) return 'URL is required';
    if (!url.match(/^(https?:\/\/)?(www\.)?github\.com\/[^/]+\/[^/]+|\b[^/]+\/[^/]+$/)) {
      return 'Please enter a valid GitHub URL in format: owner/repo or https://github.com/owner/repo';
    }
    return null;
  }

  function handleSubmit() {
    error = validateGitHubUrl(githubUrl);
    if (error) return;
    dispatch('submit', { url: githubUrl });
  }
</script>

<div class="space-y-3">
  <div>
    <label for="github-url" class="block text-sm font-medium text-gray-700 mb-1.5">
      GitHub Repository URL
    </label>
    <div class="flex gap-2">
      <input
        type="text"
        id="github-url"
        bind:value={githubUrl}
        placeholder="https://github.com/owner/repo or owner/repo"
        class="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base disabled:bg-gray-100"
        disabled={isLoading}
      />
      <button
        on:click={handleSubmit}
        disabled={isLoading || !githubUrl}
        class="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {#if isLoading}
          <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        {/if}
        Analyze
      </button>
    </div>
  </div>
  
  {#if error}
    <div class="p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-start gap-2">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>{error}</span>
    </div>
  {:else}
    <p class="text-sm text-gray-500">
      Enter the URL of any public GitHub repository (e.g., <span class="font-mono text-gray-600">chinni-03/remynd</span>)
    </p>
  {/if}
</div>
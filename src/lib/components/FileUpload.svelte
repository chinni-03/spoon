<script>
  import { createEventDispatcher } from "svelte";

  export let isLoading = false;
  const dispatch = createEventDispatcher();
  let fileInput;
  let error = null;

  function handleFileChange() {
    error = null;
    try {
      if (!fileInput?.files?.length) throw new Error("No file selected");
      const file = fileInput.files[0];
      if (!(file instanceof Blob)) throw new Error("Invalid file type");
      dispatch("submit", { file });
    } catch (err) {
      error = err.message;
      if (fileInput) fileInput.value = "";
    }
  }
</script>

<div class="flex flex-col gap-4 w-full">
  <label class="group relative flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-2xl bg-white hover:border-blue-400 transition-all cursor-pointer overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div class="relative z-10 flex flex-col items-center text-center">
      <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
      </div>
      <span class="text-lg font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
        {isLoading ? 'Processing...' : 'Drag & drop or click to browse'}
      </span>
      <p class="text-sm text-gray-500 mt-2">Supports: PDF, Markdown (.md)</p>
    </div>
    <input
      type="file"
      bind:this={fileInput}
      on:change={handleFileChange}
      accept=".md,.pdf"
      disabled={isLoading}
      class="hidden"
    />
  </label>

  {#if fileInput?.files?.[0]}
    <div class="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-700 truncate">{fileInput.files[0].name}</p>
        <p class="text-xs text-gray-500">{formatFileSize(fileInput.files[0].size)}</p>
      </div>
    </div>
  {/if}

  {#if error}
    <div class="mt-2 p-4 bg-red-50/80 backdrop-blur-sm rounded-xl flex items-start gap-3 border border-red-100">
      <div class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <p class="text-sm text-red-700">{error}</p>
    </div>
  {/if}
</div>
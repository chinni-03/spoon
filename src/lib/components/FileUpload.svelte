<!-- FileUpload.svelte -->
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

<div class="flex flex-col gap-3 w-full">
  <label class="group flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
    <div class="flex flex-col items-center text-center">
      <svg class="w-10 h-10 mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
      </svg>
      <span class="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
        {isLoading ? 'Uploading...' : 'Click to upload'}
      </span>
      <p class="text-xs text-gray-500 mt-1">Supports: .md, .pdf files</p>
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
    <div class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
      <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <span class="text-sm font-medium text-gray-700 truncate flex-1">{fileInput.files[0].name}</span>
    </div>
  {/if}

  {#if error}
    <div class="mt-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-start gap-2">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>{error}</span>
    </div>
  {/if}
</div>
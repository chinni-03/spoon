<script>
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-['Inter']">
  {@render children?.()}
</div>
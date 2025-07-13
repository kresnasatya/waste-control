<script lang="ts">
    let { children } = $props();
</script>

<div class="min-h-screen bg-red-900 text-white font-mono">
	<header class="bg-red-800 px-4 py-2">
		<h1>Database Health Check</h1>
	</header>
	
	<main class="p-4">
		{@render children()}
	</main>
</div>
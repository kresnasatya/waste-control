<script lang="ts">
	import { onMount } from 'svelte';

    let healthData = $state(null);
    let loading = $state(true);
    let error = $state<string | null>(null);

    async function checkHealth() {
        loading = true;
        error = null;
        
        try {
        const response = await fetch('/health/db');
        const data = await response.json();
        healthData = data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            error = errorMessage;
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        checkHealth();
    });
</script>

<h1>Database Health</h1>

<button onclick={checkHealth} disabled={loading}>
    {loading ? 'Checking...' : 'Refresh'}
</button>

{#if loading}
    <p>loading....</p>
{:else if error }
    <p>Error because of {error}</p>
{:else if healthData}
    <p>{JSON.stringify(healthData)}</p>
{/if}
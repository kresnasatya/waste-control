<script lang="ts">
	import { Menu } from '@lucide/svelte';
    import { onMount } from 'svelte';

    let { toggleSidebar } = $props();
</script>

<header class="bg-white shadow-sm border-b px-6 py-4">
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
            <button onclick={toggleSidebar} class="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Toggle sidebar">
                <Menu class="w-5 h-5 text-gray-600"/>
            </button>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>

        <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-gray-600">JS</span>
            </div>
            <div class="text-sm">
                <div class="font-medium">Juniarta Saputra</div>
                <div class="text-gray-500">Administrator</div>
            </div>
        </div>
    </div>
</header>
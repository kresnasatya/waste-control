<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Layout/Sidebar.svelte';
	import Header from '$lib/components/Layout/Header.svelte';

	let { children } = $props();

	let sidebarCollapsed: boolean = $state(false);

	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}
</script>

<div class="flex h-screen bg-gray-50">
	<Sidebar {sidebarCollapsed} />

	<div class="flex-1 flex flex-col overflow-hidden">
		<Header {toggleSidebar}/>

		<main class="flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
</div>
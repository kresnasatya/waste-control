<script lang="ts">
    let { statusCounts } = $props();

    let selectedArea = $state('all');

    const indicators = [
        { key: 'all', label: 'All', color: 'bg-gray-400' },
		{ key: 'toDo', label: 'To Do', color: 'bg-blue-500' },
		{ key: 'next', label: 'Next', color: 'bg-blue-600' },
		{ key: 'done', label: 'Done', color: 'bg-green-500' },
		{ key: 'anomaly', label: 'Anomaly', color: 'bg-red-500' }
    ];
</script>

<div class="mb-4">
	<div class="flex items-center space-x-4 mb-4">
		<select bind:value={selectedArea} class="border rounded-lg px-3 py-2 text-sm">
			<option value="all">Select Area</option>
			<option value="denpasar">Denpasar</option>
			<option value="badung">Badung</option>
			<option value="gianyar">Gianyar</option>
		</select>
		
		<div class="flex items-center space-x-4">
			<span class="text-sm font-medium">Indicators:</span>
			<div class="flex items-center space-x-3">
				{#each indicators as indicator}
					<button 
						class="flex items-center space-x-1 hover:opacity-80 transition-opacity"
						on:click={() => selectedArea = indicator.key}
					>
						<div class="w-3 h-3 {indicator.color} rounded-full"></div>
						<span class="text-sm">{indicator.label}</span>
					</button>
				{/each}
			</div>
		</div>
		
		<div class="ml-auto text-sm">
			<span>Total Scheduled: <strong>{statusCounts.toDo}</strong></span>
			<span class="ml-4">Total Done: <strong>{statusCounts.done}</strong></span>
		</div>
	</div>
</div>
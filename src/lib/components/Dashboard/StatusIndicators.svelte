<script lang="ts">
    let { statusCounts } = $props();

    let selectedArea = $state('all');

    const indicators = [
        { key: 'all', label: 'All', color: '' },
		{ key: 'toDo', label: 'To Do', color: 'bg-wwwaste-blue' },
		{ key: 'next', label: 'Next', color: 'bg-indicator-info' },
		{ key: 'done', label: 'Done', color: 'bg-indicator-success' },
		{ key: 'anomaly', label: 'Anomaly', color: 'bg-indicator-error' }
    ];
</script>

<div class="mb-4">
	<div class="flex items-center space-x-4 mb-4">
		<select bind:value={selectedArea} class="w-48 border rounded-lg px-3 py-2 text-sm">
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
						onclick={() => selectedArea = indicator.key}
					>
						<div class="w-3 h-3 {indicator.color} rounded-full"></div>
						<span class="text-sm">{indicator.label}</span>
					</button>
				{/each}
			</div>
		</div>
		
		<div class="ml-auto text-sm">
			<span>Total Scheduled: <strong>{statusCounts.toDo}</strong></span>
			<span class="ml-4">Total Done: <strong class="text-indicator-success">{statusCounts.done}</strong></span>
		</div>
	</div>
</div>
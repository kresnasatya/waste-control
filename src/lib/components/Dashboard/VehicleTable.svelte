<script lang="ts">
	import { ChevronDown, ChevronsUp, ChevronsUpDown } from '@lucide/svelte';

	let { vehicles } = $props();

	let sortField = $state<String>('');
	let sortDirection = $state<'asc' | 'desc'>('asc');

	const sortableFields = {
		id: 'string',
		driver: 'string',
		totalStops: 'number',
		stopsDone: 'number'
	} as const;

	let sortedVehicles = $derived.by(() => {
		if (!sortField) return vehicles;

		return [...vehicles].sort((a, b) => {
			const aValue = a[sortField as keyof typeof a];
			const bValue = b[sortField as keyof typeof b];

			let comparison = 0;

			if (sortableFields[sortField as keyof typeof sortableFields] === 'number') {
				comparison = (aValue as number) - (bValue as number);
			} else {
				comparison = String(aValue).localeCompare(String(bValue));
			}

			return sortDirection === 'asc' ? comparison : -comparison;
		})
	});

	function handleSort(field: String) {
		if (sortField === field) {
			// Toggle direction if same field
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			// New field default to ascending
			sortField = field;
			sortDirection = 'asc';
		}
	}

	function getSortIcon(field: String) {
		if (sortField !== field) return ChevronsUpDown;
		return sortDirection === 'asc' ? ChevronsUp : ChevronDown;
	}

	function getSortIconColor(field: String) {
		return sortField === field ? 'text-wwwaste-green' : 'text-shade-gray-100';
	}
</script>

<div class="bg-tint-10 rounded-lg">
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead>
				<tr>
					<th class="px-4 py-3 text-left text-sm font-medium text-shade-gray-10 tracking-wider">
						<button class="flex items-center gap-2 hover:bg-gray-100 p-1 rounded transition-colors"
							onclick={() => handleSort('id')}>
							<span class="uppercase">Vehicle</span>
							{#snippet icon()}
								{@const IconComponent = getSortIcon('id')}
								<IconComponent class="w-4 h-4 {getSortIconColor('id')}" />
							{/snippet}
							{@render icon()}
						</button>
					</th>
					<th class="px-4 py-3 text-left text-sm font-medium text-shade-gray-10 tracking-wider">
						<button class="flex items-center gap-2 hover:bg-gray-100 p-1 rounded transition-colors"
							onclick={() => handleSort('driver')}>
							<span class="uppercase">Driver</span>
							{#snippet icon()}
								{@const IconComponent = getSortIcon('driver')}
								<IconComponent class="w-4 h-4 {getSortIconColor('driver')}" />
							{/snippet}
							{@render icon()}
						</button>
					</th>
					<th class="px-4 py-3 text-left text-sm font-medium text-shade-gray-10 tracking-wider">
						<button class="flex items-center gap-2 hover:bg-gray-100 p-1 rounded transition-colors"
							onclick={() => handleSort('totalStops')}>
							<span class="uppercase">Total Stop</span>
							{#snippet icon()}
								{@const IconComponent = getSortIcon('totalStops')}
								<IconComponent class="w-4 h-4 {getSortIconColor('totalStops')}" />
							{/snippet}
							{@render icon()}
						</button>
					</th>
					<th class="px-4 py-3 text-left text-sm font-medium text-shade-gray-10 tracking-wider">
						<button class="flex items-center gap-2 hover:bg-gray-100 p-1 rounded transition-colors"
							onclick={() => handleSort('stopsDone')}>
							<span class="uppercase">Stops Done</span>
							{#snippet icon()}
								{@const IconComponent = getSortIcon('stopsDone')}
								<IconComponent class="w-4 h-4 {getSortIconColor('stopsDone')}" />
							{/snippet}
							{@render icon()}
						</button>
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each sortedVehicles as vehicle}
					<tr class="hover:bg-tint-30 transition-colors">
						<td class="px-4 py-3 text-sm underline decoration-wwwaste-green text-wwwaste-green">
							{vehicle.vehicleId}
						</td>
						<td class="px-4 py-3 text-sm underline decoration-wwwaste-green text-wwwaste-green">
							{vehicle.driver}
						</td>
						<td class="px-4 py-3 text-sm text-wwwaste-green">
							{vehicle.totalStops}
						</td>
						<td class="px-4 py-3 text-sm text-wwwaste-green">
							<div class="flex items-center">
								<span class="mr-2">{vehicle.stopsDone}</span>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
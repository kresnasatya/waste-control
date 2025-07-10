<!-- src/lib/components/Dashboard/VehicleTable.svelte -->
<script>
	let { vehicles } = $props();
</script>

<div class="bg-white rounded-lg shadow">
	<div class="p-4 border-b">
		<h3 class="font-semibold">Vehicle Management</h3>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Vehicle
					</th>
					<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Driver
					</th>
					<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Total Stop
					</th>
					<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Stops Done
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each vehicles as vehicle}
					<tr class="hover:bg-gray-50 transition-colors">
						<td class="px-4 py-3 text-sm font-medium text-gray-900">
							{vehicle.id}
						</td>
						<td class="px-4 py-3 text-sm text-gray-700">
							{vehicle.driver}
						</td>
						<td class="px-4 py-3 text-sm text-gray-700">
							{vehicle.totalStops}
						</td>
						<td class="px-4 py-3 text-sm text-gray-700">
							<div class="flex items-center">
								<span class="mr-2">{vehicle.stopsDone}</span>
								{#if vehicle.stopsDone > 0}
									<div class="w-full bg-gray-200 rounded-full h-2 max-w-20">
										<div 
											class="bg-green-600 h-2 rounded-full" 
											style="width: {(vehicle.stopsDone / vehicle.totalStops) * 100}%"
										></div>
									</div>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
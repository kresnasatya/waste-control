<script lang="ts">
	let { vehicles } = $props();
</script>

<div class="bg-white rounded-lg shadow">
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
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
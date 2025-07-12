<script lang="ts">
	let { vehicles } = $props();
</script>

<div class="bg-tint-10 rounded-lg">
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead>
				<tr>
					<th class="px-4 py-3 text-left text-sm font-medium text-shade-gray-10 uppercase tracking-wider">
						Vehicle
					</th>
					<th class="px-4 py-3 text-left text-sm font-medium text-shade-gray-10 uppercase tracking-wider">
						Driver
					</th>
					<th class="px-4 py-3 text-left text-sm font-medium text-shade-gray-10 uppercase tracking-wider">
						Total Stop
					</th>
					<th class="px-4 py-3 text-left text-sm font-medium text-shade-gray-10 uppercase tracking-wider">
						Stops Done
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each vehicles as vehicle}
					<tr class="hover:bg-gray-50 transition-colors">
						<td class="px-4 py-3 text-sm underline decoration-wwwaste-green text-wwwaste-green">
							{vehicle.id}
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
<script lang="ts">
    interface Collection {
        id: number;
        producer: string;
        wasteDetail: string;
        status: string;
    }

	let { collections, openCollectionDetails, selectedCollection }: {
        collections: Collection[];
        openCollectionDetails: (collection: Collection) => void;
		selectedCollection: Collection;
    } = $props();

	function getStatusBadgeClass(status: string): string {
		switch (status) {
			case 'Next': return 'bg-blue-100 text-blue-800';
			case 'Anomaly': return 'bg-red-100 text-red-800';
			case 'Done': return 'bg-green-100 text-green-800';
			case 'Todo': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}

	function handleRowClick(collection: Collection): void {
		openCollectionDetails(collection);
	}

    function handleKeydown(e: KeyboardEvent, collection: Collection): void {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleRowClick(collection);
        }
    }
</script>

<div class="bg-white rounded-lg shadow">
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Producer
					</th>
					<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Waste Detail
					</th>
					<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Status
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each collections as collection}
					<tr 
						class="hover:bg-gray-50 cursor-pointer transition-colors {selectedCollection.id === collection.id ? 'bg-gray-50' : ''}"
						onclick={() => handleRowClick(collection)}
						role="button"
						tabindex="0"
						onkeydown={(e) => handleKeydown(e, collection)}
					>
						<td class="px-4 py-3 text-sm font-medium text-gray-900">
							{collection.producer}
						</td>
						<td class="px-4 py-3 text-sm text-gray-700">
							{collection.wasteDetail}
						</td>
						<td class="px-4 py-3 text-sm">
							<span class="px-2 py-1 rounded-full text-xs font-medium {getStatusBadgeClass(collection.status)}">
								{collection.status}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
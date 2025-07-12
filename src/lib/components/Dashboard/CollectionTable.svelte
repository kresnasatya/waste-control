<script lang="ts">
	import { capitalizeLetter, getStatusClass } from '$lib/helper';

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

<div class="bg-tint-10 rounded-lg">
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead>
				<tr>
					<th class="px-4 py-3 text-left text-xs font-medium text-shade-gray-10 uppercase tracking-wider">
						Producer
					</th>
					<th class="px-4 py-3 text-left text-xs font-medium text-shade-gray-10 uppercase tracking-wider">
						Waste Detail
					</th>
					<th class="px-4 py-3 text-left text-xs font-medium text-shade-gray-10 uppercase tracking-wider">
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
						<td class="px-4 py-3 text-sm underline decoration-wwwaste-green text-wwwaste-green">
							{collection.producer}
						</td>
						<td class="px-4 py-3 text-sm underline decoration-wwwaste-green text-wwwaste-green">
							{collection.wasteDetail}
						</td>
						<td class="px-4 py-3 text-sm">
							<span class={getStatusClass(collection.status)}>
								{capitalizeLetter(collection.status)}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
<script lang="ts">
	import CollectionHistory from '../CollectDetails/CollectionHistory.svelte';
	import MapInfo from '../CollectDetails/MapInfo.svelte';
	import ProducerInfo from '../CollectDetails/ProducerInfo.svelte';
	
	let { collection } = $props();

	const collectionDetails = $derived({
		producerName: collection.producer,
		address: 'Jl. Gatot Subroto Barat No.466 448',
		city: 'Kota Denpasar',
		province: 'Bali',
		postalCode: '80116',
		phone: '+62 8917788123',
		driver: 'Aditya Ramadhan',
		status: collection.status,
		container: 'Container Disposable 25L RED - 1',
		product: 'Infused 10 KG - 1 - Rp 150.000 - Rp 1.500.000'
	});

	const collectionHistory = [
		{ time: 'Thu,18/07/2024 17:07:45', status: 'Pending' },
		{ time: 'Thu,18/07/2024 17:10:45', status: 'Approved' },
		{ time: 'Thu,18/07/2024 18:00:05', status: 'Picked Up' },
		{ time: 'Thu,18/07/2024 18:10:05', status: 'Arrived' },
		{ time: 'Thu,18/07/2024 18:20:05', status: 'Collected', info: 'Note: COLLECTED' }
	];
</script>

<div class="bg-white rounded-lg shadow p-6 mb-6">
	<h2 class="text-xl font-semibold">Collect Details</h2>
	<p class="text-gray-600 mb-6">Details of collect</p>
	
	<div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
		<div class="col-span-2">
			<h3 class="font-semibold mb-4 pb-4 border-b border-shade-gray-100">Producer</h3>
			<!-- Producer Info -->
			<ProducerInfo collectionDetails={collectionDetails} />

			<!-- Location Map -->
			<MapInfo />
		</div>

		<!-- Collection Request -->
		<div class="col-span-2">
			<h3 class="font-semibold mb-4 pb-4 border-b border-shade-gray-100">Collect Request From Producer</h3>
			<div class="space-y-4 bg-tint-10 rounded-lg mb-4">
				<table class="w-full table-auto">
					<thead>
						<tr class="text-shade-gray-10 font-medium">
							<td class="py-2 pl-4">CONTAINER NAME</td>
							<td>AMOUNT</td>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr>
							<td class="py-2 pl-4 text-sm text-shade-gray-10">Container Disposable 25L RED</td>
							<td class="text-shade-gray-40 text-sm">1</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div>
				<h3 class="font-semibold mb-4 pb-4 border-b border-shade-gray-100">Collect Data From Driver</h3>
				<div class="overflow-x-auto bg-tint-10 rounded-lg">
					<table class="w-full text-sm">
						<thead>
							<tr class="uppercase">
								<th class="pl-4 py-2 text-left">Product Name</th>
								<th class="px-2 py-2 text-left">Total</th>
								<th class="px-2 py-2 text-left">Container</th>
								<th class="px-2 py-2 text-left">Price (KG)</th>
								<th class="px-2 py-2 text-left">Total Price</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							<tr>
								<td class="px-2 py-2">Infused</td>
								<td class="px-2 py-2">10 KG</td>
								<td class="px-2 py-2">1</td>
								<td class="px-2 py-2">Rp 150.000</td>
								<td class="px-2 py-2">Rp 1.500.000</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div>
			<h3 class="font-semibold mb-4 pb-4 border-b border-shade-gray-100">Collect History</h3>
			<!-- Collection History -->
			<CollectionHistory collectionHistory={collectionHistory} />
		</div>
	</div>
</div>
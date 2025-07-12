<script lang="ts">
	import { Phone, Map } from '@lucide/svelte';
	
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

	const collectHistory = [
		{ time: 'Thu,18/07/2024 17:07:45', status: 'Pending' },
		{ time: 'Thu,18/07/2024 17:10:45', status: 'Approved' },
		{ time: 'Thu,18/07/2024 18:00:05', status: 'Picked Up' },
		{ time: 'Thu,18/07/2024 18:10:05', status: 'Arrived' },
		{ time: 'Thu,18/07/2024 18:20:05', status: 'Collected', info: 'Note: COLLECTED' }
	];

	function getStatusClass(status: string): string {
		switch (status) {
			case 'Next': return 'text-indicator-info';
			case 'Anomaly': return 'text-indicator-error';
			case 'Done': return 'text-indicator-done';
			case 'Todo': return 'text-wwwaste-blue';
			default: return 'text-gray-800';
		}
	}
</script>

<div class="bg-white rounded-lg shadow p-6 mb-6">
	<h2 class="text-xl font-semibold">Collect Details</h2>
	<p class="text-gray-600 mb-6">Details of collect</p>
	
	<div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
		<!-- Producer Info -->
		<div class="col-span-2">
			<h3 class="font-semibold mb-4 pb-4 border-b border-shade-gray-100">Producer</h3>
			<div class="space-y-3 text-sm">
				<table class="w-full table-auto">
					<tbody>
						<tr>
							<td class="py-2 text-shade-gray-10">Producer Name</td>
							<td class="text-shade-gray-40">{collectionDetails.producerName}</td>
						</tr>
						<tr>
							<td class="py-2 text-shade-gray-10">Collect Address</td>
							<td class="text-shade-gray-40">{collectionDetails.address}</td>
						</tr>
						<tr>
							<td class="py-2 text-shade-gray-10">City</td>
							<td class="text-shade-gray-40">{collectionDetails.city}</td>
						</tr>
						<tr>
							<td class="py-2 text-shade-gray-10">Province</td>
							<td class="text-shade-gray-40">{collectionDetails.province}</td>
						</tr>
						<tr>
							<td class="py-2 text-shade-gray-10">Postal Code</td>
							<td class="text-shade-gray-40">{collectionDetails.postalCode}</td>
						</tr>
						<tr>
							<td class="py-2 text-shade-gray-10">Phone</td>
							<td class="text-shade-gray-40">{collectionDetails.phone}</td>
						</tr>
						<tr>
							<td class="py-2 text-shade-gray-10">Driver</td>
							<td class="text-shade-gray-40">{collectionDetails.driver}</td>
						</tr>
						<tr>
							<td class="py-2 text-shade-gray-10">Proof Capture</td>
							<td>
								<div class="mt-1">
									<div class="w-16 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
										<span class="text-xs text-gray-500">Image</span>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td class="py-2 text-shade-gray-10">Status</td>
							<td>
								<div class="mt-1">
									<span class="py-1 rounded-full text-sm font-medium {getStatusClass(collectionDetails.status)}">
										{collectionDetails.status}
									</span>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Location Map -->
			<div class="mt-6">
				<div class="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
					<Map class="w-8 h-8 text-gray-400" />
				</div>
			</div>
		</div>

		<!-- Collect Request -->
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

		<!-- Collect History -->
		<div>
			<h3 class="font-semibold mb-4 pb-4 border-b border-shade-gray-100">Collect History</h3>
			<div class="space-y-3">
				{#each collectHistory as item}
					<div class="flex items-start space-x-3 border-b border-shade-gray-100 pb-4">
						<div class="text-sm text-gray-10 min-w-0 flex-1">
							<div>{item.time}</div>
							<div>{item.status}</div>
							{#if item.info}
								<div>{item.info}</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
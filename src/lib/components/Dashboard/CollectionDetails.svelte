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
		{ time: 'Thu,18/07/2024 18:20:05', status: 'Collected' }
	];

	function getStatusBadgeClass(status: string): string {
		switch (status) {
			case 'Next': return 'bg-blue-100 text-blue-800';
			case 'Anomaly': return 'bg-red-100 text-red-800';
			case 'Done': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div class="bg-white rounded-lg shadow p-6 mb-6">
	<h2 class="text-xl font-semibold">Collect Details</h2>
	<p class="text-gray-600 mb-6">Details of collect</p>
	
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Producer Info -->
		<div>
			<h3 class="font-semibold mb-4">Producer</h3>
			<div class="space-y-3 text-sm">
				<div>
					<span class="text-gray-600">Producer Name</span>
					<div class="font-medium">{collectionDetails.producerName}</div>
				</div>
				<div>
					<span class="text-gray-600">Collect Address</span>
					<div class="font-medium">{collectionDetails.address}</div>
				</div>
				<div>
					<span class="text-gray-600">City</span>
					<div class="font-medium">{collectionDetails.city}</div>
				</div>
				<div>
					<span class="text-gray-600">Province</span>
					<div class="font-medium">{collectionDetails.province}</div>
				</div>
				<div>
					<span class="text-gray-600">Postal Code</span>
					<div class="font-medium">{collectionDetails.postalCode}</div>
				</div>
				<div>
					<span class="text-gray-600">Phone</span>
					<div class="font-medium flex items-center">
						<Phone class="w-4 h-4 mr-1" />
						{collectionDetails.phone}
					</div>
				</div>
				<div>
					<span class="text-gray-600">Driver</span>
					<div class="font-medium">{collectionDetails.driver}</div>
				</div>
				<div>
					<span class="text-gray-600">Proof Capture</span>
					<div class="mt-1">
						<div class="w-16 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
							<span class="text-xs text-gray-500">Image</span>
						</div>
					</div>
				</div>
				<div>
					<span class="text-gray-600">Status</span>
					<div class="mt-1">
						<span class="px-2 py-1 rounded-full text-xs font-medium {getStatusBadgeClass(collectionDetails.status)}">
							{collectionDetails.status}
						</span>
					</div>
				</div>
			</div>

			<!-- Location Map -->
			<div class="mt-6">
				<div class="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
					<Map class="w-8 h-8 text-gray-400" />
				</div>
			</div>
		</div>

		<!-- Collect Request -->
		<div>
			<h3 class="font-semibold mb-4">Collect Request From Producer</h3>
			<div class="space-y-4">
				<div>
					<div class="text-sm font-medium mb-2">Container Name</div>
					<div class="bg-gray-50 p-3 rounded border">
						<div class="text-sm font-medium">Container Disposable 25L RED</div>
						<div class="text-xs text-gray-600 mt-1">Amount: 1</div>
					</div>
				</div>
				
				<div>
					<h4 class="font-medium mb-3">Collect Data From Driver</h4>
					<div class="overflow-x-auto">
						<table class="w-full text-xs">
							<thead class="bg-gray-50">
								<tr>
									<th class="px-2 py-2 text-left">Product Name</th>
									<th class="px-2 py-2 text-left">Total</th>
									<th class="px-2 py-2 text-left">Container</th>
									<th class="px-2 py-2 text-left">Price (KG)</th>
									<th class="px-2 py-2 text-left">Total Price</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td class="px-2 py-2">Infused</td>
									<td class="px-2 py-2">10 KG</td>
									<td class="px-2 py-2">1</td>
									<td class="px-2 py-2">Rp 150.000</td>
									<td class="px-2 py-2 font-medium">Rp 1.500.000</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<!-- Collect History -->
		<div>
			<h3 class="font-semibold mb-4">Collect History</h3>
			<div class="space-y-3">
				{#each collectHistory as item}
					<div class="flex items-start space-x-3">
						<div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
						<div class="text-sm min-w-0 flex-1">
							<div class="text-gray-600 text-xs">{item.time}</div>
							<div class="font-medium">{item.status}</div>
						</div>
					</div>
				{/each}
			</div>
			
			<div class="mt-4 p-3 bg-green-50 rounded-lg">
				<div class="text-sm font-medium text-green-800">Note: COLLECTED</div>
			</div>
		</div>
	</div>
</div>
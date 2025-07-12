<script lang="ts">
    let { collectionDetails } = $props();

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
<script lang="ts">
    import { onMount } from 'svelte';
    import { createDialog, melt } from '@melt-ui/svelte';
    import { MapPin, Settings, Circle, Eye, Phone } from '@lucide/svelte';
    import MapView from '$lib/components/Dashboard/MapView.svelte';
    import StatusIndicators from '$lib/components/Dashboard/StatusIndicators.svelte';
    import VehicleTable from '$lib/components/Dashboard/VehicleTable.svelte';
    import CollectionTable from '$lib/components/Dashboard/CollectionTable.svelte';
    import CollectionDetails from '$lib/components/Dashboard/CollectionDetails.svelte';

    let currentDateTime = $state('');

    onMount(() => {
        const updateDateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            currentDateTime = now.toLocaleDateString('en-US', options);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);

        return () => clearInterval(interval);
    });

    // Sample data
    let statusCounts = $state({
        toDo: 10,
        next: 2,
        done: 4,
        anomaly: 1
    });

    let vehicles = $state([
        {
            id: 'DK 1289 BUY',
            driver: 'Wayan Nico',
            totalStops: 3,
            stopsDone: 0
        },
        {
            id: 'DK 8080 YU',
            driver: 'Nyoman Bagiada',
            totalStops: 5,
            stopsDone: 3
        },
        {
            id: 'DK 0223 AHS',
            driver: 'Saipul Rahmat',
            totalStops: 2,
            stopsDone: 0
        },
        {
            id: 'DK 4567 XYZ',
            driver: 'Made Surya',
            totalStops: 3,
            stopsDone: 1
        }
    ]);

    let collections = $state([
        {
            id: 1,
            producer: 'Dental Bali',
            wasteDetail: 'Medical A-233',
            status: 'Next'
        },
        {
            id: 2,
            producer: 'Clinic Pratama',
            wasteDetail: 'Medical A-331, A-321',
            status: 'Next'
        },
        {
            id: 3,
            producer: 'Vet Global Bali',
            wasteDetail: 'Medical A-331, A-321, A-432',
            status: 'Anomaly'
        }
    ]);

    let selectedCollection = $state(null);

    // Create dialog using Melt UI
    const {
        elements: { trigger, overlay, content, title, description, close },
        states: { open }
    } = createDialog({
        forceVisible: true
    });

    function openCollectionDetails(collection: any) {
        selectedCollection = collection;
        open.set(true);
    }

    function closeModal() {
        open.set(false);
        selectedCollection = null;
    }

    // Mock real-time monitoring state
    let monitoringActive = $state(false);
    let lastUpdate = $state('11:00:00');

    function toggleMonitoring() {
        monitoringActive = !monitoringActive;
        if (monitoringActive) {
            lastUpdate = new Date().toLocaleTimeString();
        }
    }
</script>

<svelte:head>
    <title>Waste Management Dashboard</title>
</svelte:head>

<div class="p-6">
    <!-- Dashboard header with date/time and action buttons -->
    <div class="flex items-center justify-between mb-6">
        <div class="text-sm text-gray-600">
            {currentDateTime}
        </div>

        <div class="flex items-center space-x-2">
			<button class="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
				Realtime
			</button>
			<button class="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
				Collect History
			</button>
			<button class="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
				Statistic
			</button>
			<button class="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors">
				AI Mira
			</button>
		</div>
    </div>

    <!-- Real-time Monitoring Section -->
	<div class="bg-white rounded-lg shadow p-6 mb-6">
		<div class="flex items-center justify-between mb-6">
			<div class="flex items-center space-x-2">
				<MapPin class="w-5 h-5 text-blue-600" />
				<h2 class="text-lg font-semibold">Real-time Monitoring</h2>
				<span class="text-sm text-gray-500">
					{monitoringActive ? 'Connected' : 'Disconnected'} • Last update: {lastUpdate}
				</span>
			</div>
			
			<div class="flex items-center space-x-4">
				<button class="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
					<Settings class="w-4 h-4" />
					<span>Settings</span>
				</button>
				<button 
					onclick={toggleMonitoring}
					class="flex items-center space-x-2 text-sm transition-colors
						{monitoringActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}"
				>
					<Circle class="w-4 h-4 {monitoringActive ? 'fill-current' : ''}" />
					<span>{monitoringActive ? 'Stop Monitoring' : 'Start Monitoring'}</span>
				</button>
				<button class="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
					<Eye class="w-4 h-4" />
					<span>Reset Data</span>
				</button>
			</div>
		</div>
        <StatusIndicators {statusCounts} />
	</div>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Map and Indicators -->
			<div class="lg:col-span-1">
				<MapView />
			</div>

			<!-- Collection Info Panel -->
			<div class="space-y-4">
                <VehicleTable {vehicles} />
                <CollectionTable {collections} {openCollectionDetails} />
            </div>
		</div>
    </div>
</div>

<!-- Collection Details Modal using Melt UI -->
{#if $open}
	<div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50">
		<div
			use:melt={$content}
			class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
		>
			<div class="flex items-center justify-between mb-6">
				<h2 use:melt={$title} class="text-xl font-semibold">Collect Details</h2>
				<button
					use:melt={$close}
					class="text-gray-400 hover:text-gray-600 text-2xl"
				>
					×
				</button>
			</div>
			
			{#if selectedCollection}
				<CollectionDetails collection={selectedCollection} />
			{/if}
		</div>
	</div>
{/if}
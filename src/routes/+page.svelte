<script lang="ts">
    import { onMount } from 'svelte';
    import { Settings, Sparkles, ChartNoAxesCombined, History, Activity, WifiOff, Wifi, Play, Pause, RefreshCw } from '@lucide/svelte';
    import { vehicles } from '$lib/stores/vehicles.svelte';
    import { collections } from '$lib/stores/collections.svelte';
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

    

    let selectedCollection = $state(collections[0]);
    
    function openCollectionDetails(collection: any) {
        selectedCollection = collection;
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
			<button class="px-3 py-2 bg-tint-10 text-wwwaste-green rounded-lg text-sm font-medium hover:bg-tint-10 transition-colors">
				<div class="flex items-center gap-2">
                    <span>Realtime</span>
                    <Activity class="text-wwwaste-green inline h-4 w-4"/>
                </div>
			</button>
			<button class="px-3 py-2 border border-wwwaste-green text-wwwaste-green rounded-lg text-sm font-medium hover:bg-tint-10 transition-colors">
                <div class="flex items-center gap-2">
                    <span>Collect History</span>
                    <History class="text-wwwaste-green inline h-4 w-4"/>
                </div>
			</button>
			<button class="px-3 py-2 border border-wwwaste-green text-wwwaste-green rounded-lg text-sm font-medium hover:bg-tint-10 transition-colors">
				<div class="flex items-center gap-2">
                    <span>Statistic</span>
                    <ChartNoAxesCombined class="text-wwwaste-green inline h-4 w-4"/>
                </div>
			</button>
            <div class="p-0.25 bg-linear-to-r from-mira-orange to-mira-red rounded-lg">
			    <button class="bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-sm text-transparent bg-linear-to-r from-mira-orange to-mira-red bg-clip-text">
                            AI Mira
                        </span>
                        <Sparkles class="text-orange-300 inline h-4 w-4"/>
                    </div>
                </button>
            </div>
		</div>
    </div>

    <!-- Real-time Monitoring Section -->
	<div class="bg-white rounded-lg shadow p-6 mb-6">
		<div class="flex items-center justify-between mb-6">
			<div class="flex items-center space-x-2">
				<Activity class="w-5 h-5 text-blue-600" />
				<h2 class="text-lg font-semibold">Real-time Monitoring</h2>
				<span class="text-sm text-gray-500">
                    {#if monitoringActive}
                        <div class="flex items-center gap-2">
                            <Wifi class="inline h-5 w-5" />
                            <span>Connected</span>
                        </div>
                    {:else}
                        <div class="flex items-center gap-2">
                            <WifiOff class="inline h-5 w-5" />
                            <span>Disconnected</span>
                        </div>
                    {/if}
				</span>
                <span class="text-sm text-gray-500">
                    Last update: {lastUpdate}
                </span>
			</div>
			
			<div class="flex items-center space-x-4">
				<button class="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 p-2 rounded-lg">
					<Settings class="w-4 h-4" />
					<span>Settings</span>
				</button>
				<button 
					onclick={toggleMonitoring}
					class="flex items-center space-x-2 text-sm transition-colors p-2 rounded-lg
						{monitoringActive ? 'bg-red-200 hover:bg-red-400 text-red-600 hover:text-red-800' : 'bg-tint-10 hover:bg-tint-20 text-wwwaste-green'}"
				>
                    {#if monitoringActive}
                        <Pause class="w-4 h-4 fill-current" />
                    {:else}
                        <Play class="w-4 h-4 fill-current" />
                    {/if}
					<span>{monitoringActive ? 'Stop Monitoring' : 'Start Monitoring'}</span>
				</button>
				<button class="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 p-2 rounded-lg">
					<RefreshCw class="w-4 h-4" />
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
                <CollectionTable {collections} {openCollectionDetails} {selectedCollection} />
            </div>
		</div>
    </div>

    <!-- Collection details goes here -->
    <CollectionDetails collection={selectedCollection}/>
</div>
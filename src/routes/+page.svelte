<script lang="ts">
    import { onMount } from 'svelte';
    import { Settings, Sparkles, ChartNoAxesCombined, History, Activity, WifiOff, Wifi, Play, Pause, RefreshCw, Download, Truck } from '@lucide/svelte';
    import { vehicles } from '$lib/stores/vehicles.svelte';
    import { collections } from '$lib/stores/collections.svelte';
    import MapView from '$lib/components/Dashboard/MapView.svelte';
    import StatusIndicators from '$lib/components/Dashboard/StatusIndicators.svelte';
    import VehicleTable from '$lib/components/Dashboard/VehicleTable.svelte';
    import CollectionTable from '$lib/components/Dashboard/CollectionTable.svelte';
	import CollectionDetails from '$lib/components/Dashboard/CollectionDetails.svelte';
	import { getStatusClass } from '$lib/helper';
    import { Chart, registerables } from 'chart.js';
	import { realtimeCollectionData, wasteTypeDistribution } from '$lib/stores/statistic.svelte';

    let currentView = $state<String>('realtime');
    let currentDateTime = $state('');

    // Hash mapping
    const hashMap = {
        'realtime': '',
        'history': 'collect-history',
        'statistic': 'statistic',
        'ai': 'ai-mira'
    };

    function getViewFromHash(): String
    {
        const hash = window.location.hash.slice(1);
        return Object.keys(hashMap).find(key => hashMap[key as keyof typeof hashMap] === hash) || 'realtime';
    }

    function navigateToView(view: String): void
    {
        const hash = hashMap[view as keyof typeof hashMap];
        window.location.hash = hash;
        currentView = view;
    }

    onMount(() => {
        // Set initial view from URL
        currentView = getViewFromHash();

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

        // Hash change listener
        const handleHashChange = () => {
            currentView = getViewFromHash();
        }

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            clearInterval(interval);
            window.removeEventListener('hashchange', handleHashChange);
        };
    });

    // Sample data
    let statusCounts = $state({
        toDo: 10,
        next: 2,
        done: 4,
        anomaly: 1
    });

    let selectedCollection = $state(collections[0]);
    
    function handleCollectionDetails(collection: any) {
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

    // Collection history filters
    let historyFilters = $state({
        area: '',
        dateRange: 'last-7-days',
        wasteType: 'medical'
    });

    // Mock historical data
    let historicalCollections = $state([
        { id: 1, producer: 'Dental Bali', category: 'Medical', date: 'Sat, 06/14/2024 | 10:00', vehicle: 'DK 0225 OHS', driver: 'Jordan', wasteDetails: 'Medical A-353, A-323', status: 'done' },
        { id: 2, producer: 'Clinic Pratama', category: 'Medical', date: 'Thu, 06/12/2024 | 08:00', vehicle: 'DK 0223 AHS', driver: 'Nico', wasteDetails: 'Medical A-331, A-321', status: 'done' },
        { id: 3, producer: 'Vet Global Bali', category: 'Medical', date: 'Fri, 06/13/2024 | 09:30', vehicle: 'DK 0224 BHS', driver: 'Alex', wasteDetails: 'Medical A-335, A-322', status: 'done' },
        { id: 4, producer: 'Wellness Center Alpha', category: 'Medical', date: 'Sun, 06/15/2024 | 11:15', vehicle: 'DK 0226 NHS', driver: 'Sam', wasteDetails: 'Medical A-334, A-324', status: 'done' },
        { id: 5, producer: 'Bali Nutrition Hub', category: 'Medical', date: 'Mon, 06/16/2024 | 08:45', vehicle: 'DK 0227 EHS', driver: 'Taylor', wasteDetails: 'Medical A-335, A-325', status: 'done' },
        { id: 6, producer: 'Therapeutic Massage Bali', category: 'Medical', date: 'Tue, 06/17/2024 | 14:30', vehicle: 'DK 0228 FHS', driver: 'Jamie', wasteDetails: 'Medical A-336, A-326', status: 'done' },
        { id: 7, producer: 'Bali Physiotherapy', category: 'Medical', date: 'Wed, 06/18/2024 | 12:00', vehicle: 'DK 0229 GHS', driver: 'Morgan', wasteDetails: 'Medical A-337, A-327', status: 'cancelled' },
        { id: 8, producer: 'Mindfulness Retreat Center', category: 'Medical', date: 'Thu, 06/19/2024 | 09:00', vehicle: 'DK 0230 HHS', driver: 'Casey', wasteDetails: 'Medical A-338, A-328', status: 'cancelled' }
    ]);

    // Register chart.js components
    Chart.register(...registerables);

    let timeSeriesCanvas: HTMLCanvasElement | null = $state(null);
    let timeSeriesChart: Chart | null = $state(null);

    // Reset chart when canvas change to null
    $effect(() => {
        if (!timeSeriesCanvas && timeSeriesChart) {
            timeSeriesChart.destroy();
            timeSeriesChart = null;
        }
    })

    // Create chart when canvas become available
    $effect(() => {
        if (timeSeriesCanvas && !timeSeriesChart) {
            timeSeriesChart = new Chart(timeSeriesCanvas, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: []
                },
                options: {}
            });
        }
    })

    // Update chart data
    $effect(() => {
        if (timeSeriesChart) {
            timeSeriesChart.data = {
                labels: realtimeCollectionData.map(d => d.time),
                datasets: [
                    {
                        label: 'Recyclable',
                        data: realtimeCollectionData.map(d => d.recyclable),
                        borderColor: '#4F46E5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#4F46E5',
                        pointBorderColor: '#4F46E5',
                        pointRadius: 4
                    },
                    {
                        label: 'Organic',
                        data: realtimeCollectionData.map(d => d.organic),
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#10B981',
                        pointBorderColor: '#10B981',
                        pointRadius: 4
                    },
                    {
                        label: 'General',
                        data: realtimeCollectionData.map(d => d.general),
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#F59E0B',
                        pointBorderColor: '#F59E0B',
                        pointRadius: 4
                    },
                    {
                        label: 'Hazardous',
                        data: realtimeCollectionData.map(d => d.hazardous),
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#EF4444',
                        pointBorderColor: '#EF4444',
                        pointRadius: 4
                    }
                ]
            };

            timeSeriesChart.options = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time Period'
                        },
                        grid: {
                            color: '#f3f4f6'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Weight (Kg)'
                        },
                        beginAtZero: true,
                        max: 160,
                        ticks: {
                            stepSize: 20,
                            callback: function(value: any): string {
                                return value + 'KG';
                            }
                        },
                        grid: {
                            color: '#f3f4f6'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }

            timeSeriesChart.update();
        }
    });

    let pieCanvas: HTMLCanvasElement | null = $state(null);
    let pieChart: Chart | null = $state(null);

    // Reset pie chart when canvas changes to null
    $effect(() => {
        if (!pieCanvas && pieChart) {
            pieChart.destroy();
            pieChart = null;
        }
    });

    $effect(() => {
        if (pieCanvas && !pieChart) {
            pieChart = new Chart(pieCanvas, {
                type: 'pie',
                data: {
                    datasets: [],
                    labels: [],
                },
                options: {},
            });
        }
    });

    $effect(() => {
        if (pieChart) {
            pieChart.data = {
                labels: wasteTypeDistribution.map(d => d.category),
                datasets: [{
                    data: wasteTypeDistribution.map(d => d.percentage),
                    backgroundColor: wasteTypeDistribution.map(d => d.color),
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 8
                }]
            };

            pieChart.options = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context: any): string {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                elements: {
                    arc: {
                        borderWidth: 2
                    }
                }
            };

            pieChart.update();
        }
    });
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
			<button onclick={() => navigateToView('realtime')} class="px-3 py-2 
                {currentView === 'realtime' ? 'bg-tint-10 text-wwwaste-green' : 'border border-wwwaste-green text-wwwaste-green'} rounded-lg text-sm font-medium hover:bg-tint-10 transition-colors">
				<div class="flex items-center gap-2">
                    <span>Realtime</span>
                    <Activity class="text-wwwaste-green inline h-4 w-4"/>
                </div>
			</button>
			<button onclick={() => navigateToView('history')} class="px-3 py-2
                {currentView === 'history' ? 'bg-tint-10 text-wwwaste-green' : 'border border-wwwaste-green text-wwwaste-green'} rounded-lg text-sm font-medium hover:bg-tint-10 transition-colors">
                <div class="flex items-center gap-2">
                    <span>Collect History</span>
                    <History class="text-wwwaste-green inline h-4 w-4"/>
                </div>
			</button>
			<button onclick={() => navigateToView('statistic')} class="px-3 py-2
            {currentView === 'statistic' ? 'bg-tint-10 text-wwwaste-green' : 'border border-wwwaste-green text-wwwaste-green'} rounded-lg text-sm font-medium hover:bg-tint-10 transition-colors">
				<div class="flex items-center gap-2">
                    <span>Statistic</span>
                    <ChartNoAxesCombined class="text-wwwaste-green inline h-4 w-4"/>
                </div>
			</button>
            <div class="p-0.25 bg-linear-to-r from-mira-orange to-mira-red rounded-lg">
			    <button onclick={() => navigateToView('ai')} class="bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
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
	{#if currentView === 'realtime'}
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
				<MapView collections={collections} />
			</div>

			<!-- Collection Info Panel -->
			<div class="space-y-4">
                <VehicleTable {vehicles} />
                <CollectionTable {collections} {handleCollectionDetails} {selectedCollection} />
            </div>
		</div>
    </div>

    <!-- Collection details goes here -->
    <CollectionDetails collection={selectedCollection}/>
    {/if}

    {#if currentView === 'history'}
        <!-- Collection History View -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-4">
                    <select bind:value={historyFilters.area} class="w-full border rounded-lg px-3 py-2 text-sm">
                        <option value="">Select Area</option>
                        <option value="denpasar">Denpasar</option>
                        <option value="badung">Badung</option>
                    </select>
                    <select bind:value={historyFilters.dateRange} class="w-full border rounded-lg px-3 py-2 text-sm">
                        <option value="last-7-days">Last 7 days</option>
                    </select>
                    <select bind:value={historyFilters.wasteType} class="w-full border rounded-lg px-3 py-2 text-sm">
                        <option value="">Select Waste Type</option>
                        <option value="medical">Medical</option>
                        <option value="general">General</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="space-y-4 bg-tint-10 rounded-lg mb-4">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr>
                                    <th class="font-medium text-left p-3 text-shade-gray-10">PRODUCER</th>
                                    <th class="font-medium text-left p-3 text-shade-gray-10">CATEGORY</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                {#each historicalCollections as collection}
                                    <tr class="hover:bg-tint-30 transition-colors">
                                        <td class="px-3 py-4 text-sm underline decoration-wwwaste-green text-wwwaste-green">{collection.producer}</td>
                                        <td class="px-3 py-4 text-shade-gray-50">{collection.category}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow p-6 col-span-2">
                <div class="space-y-4 bg-tint-10 rounded-lg mb-4">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr>
                                    <th class="font-medium uppercase text-left p-3">Date</th>
                                    <th class="font-medium uppercase text-left p-3">Vehicle</th>
                                    <th class="font-medium uppercase text-left p-3">Driver</th>
                                    <th class="font-medium uppercase text-left p-3">Waste Details</th>
                                    <th class="font-medium uppercase text-left p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                {#each historicalCollections as collection}
                                    <tr class="hover:bg-tint-30 transition-colors">
                                        <td class="px-3 py-4 text-shade-gray-10">{collection.date}</td>
                                        <td class="px-3 py-4 text-wwwaste-green">{collection.vehicle}</td>
                                        <td class="px-3 py-4 text-wwwaste-green">{collection.driver}</td>
                                        <td class="px-3 py-4 text-wwwaste-green">{collection.wasteDetails}</td>
                                        <td class="px-3 py-4 text-wwwaste-green">
                                            <span class="px-2 py-1 rounded text-xs font-medium {getStatusClass(collection.status)} capitalize">
                                                {collection.status}
                                            </span>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <CollectionDetails collection={selectedCollection} />
    {/if}

    {#if currentView === 'statistic'}
        <!-- Collection History View -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-semibold">Statistic this month</p>
                </div>
                <div class="flex items-center gap-2 w-1/2">
                    <select class="w-full rounded-lg p-2 text-sm border border-shade-gray-100 text-shade-gray-50">
                        <option value="this-month">This Month</option>
                        <option value="last-month">Last Month</option>
                        <option value="last-3-months">Last 3 Months</option>
                    </select>
                    <button class="w-full flex justify-center border border-shade-gray-100 text-shade-gray-40 hover:bg-shade-gray-100 cursor-pointer rounded-lg p-2">
                        <span>Refresh Data</span>
                    </button>
                    <button class="w-full flex justify-center items-center gap-2 border border-shade-gray-100 text-shade-gray-40 hover:bg-shade-gray-100 cursor-pointer rounded-lg p-2">
                        <span>Export</span>
                        <Download class="h-4 w-4 inline"/>
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow p-4">
                <div class="flex justify-between">
                    <div class="flex flex-col">
                        <span class="font-bold">Total Collected Today</span>
                        <span class="font-bold text-2xl">1,245 KG</span>
                        <div><span class="text-indicator-success font-semibold">18%</span> from yesterday</div>
                    </div>
                    <div>
                        <div class="rounded-full bg-green-100 p-2">
                            <ChartNoAxesCombined class="h-4 w-4 text-indicator-success" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
                <div class="flex justify-between">
                    <div class="flex flex-col">
                        <span class="font-bold">Active Collections</span>
                        <span class="font-bold text-2xl">7</span>
                        <div><span class="text-indicator-success font-semibold">2</span> from last hour</div>
                    </div>
                    <div>
                        <div class="rounded-full bg-semi-transparent-blue p-2">
                            <Truck class="h-4 w-4 text-semi-transparent-blue" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
                <div class="flex justify-between">
                    <div class="flex flex-col">
                        <span class="font-bold">Producers Serviced</span>
                        <span class="font-bold text-2xl">12/24</span>
                        <div><span class="text-indicator-success font-semibold">50%</span> completion rate</div>
                    </div>
                    <div>
                        <div class="rounded-full bg-green-100 p-2">
                            <ChartNoAxesCombined class="h-4 w-4 text-indicator-success" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
                <div class="flex justify-between">
                    <div class="flex flex-col">
                        <span class="font-bold">Efficiency Rate</span>
                        <span class="font-bold text-2xl">93.2%</span>
                        <div><span class="text-indicator-success font-semibold">3.1%</span> from last week</div>
                    </div>
                    <div>
                        <div class="rounded-full bg-green-100 p-2">
                            <ChartNoAxesCombined class="h-4 w-4 text-indicator-success" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow p-4">
                <h2 class="text-xl font-bold">Realtime Collection Activity</h2>
                <p class="text-xs text-shade-gray-50">Waste collection volume overtime (Kg)</p>
                <div class="chart-wrapper">
                    <canvas bind:this={timeSeriesCanvas}></canvas>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
                <h2 class="text-xl font-bold">Waste Type Distribution</h2>
                <p class="text-xs text-shade-gray-50">Breakdown by waste categories</p>
                <div class="chart-wrapper">
                    <canvas bind:this={pieCanvas}></canvas>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .chart-wrapper {
        position: relative;
        height: 400px;
    }
</style>
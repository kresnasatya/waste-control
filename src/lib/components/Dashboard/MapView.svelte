<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import "leaflet/dist/leaflet.css";

    interface Marker {
        id: number;
        lat: number;
        lng: number;
        status: string;
        title: string;
        type: string;
    }

    let { markers = [], height = '400px'}: {
        markers?: Marker[];
        height?: string;
    } = $props();

    let mapContainer: HTMLDivElement;
    let map: any;
    let L: any;

    const defaultMarkers: Marker[] = [
        { id: 1, lat: -8.670458, lng: 115.212631, status: 'done', title: 'Dental Bali', type: 'Medical A-233' },
		{ id: 2, lat: -8.650000, lng: 115.220000, status: 'next', title: 'Clinic Pratama', type: 'Medical A-331, A-321' },
		{ id: 3, lat: -8.680000, lng: 115.200000, status: 'anomaly', title: 'Vet Global Bali', type: 'Medical A-331, A-321, A-432' },
		{ id: 4, lat: -8.660000, lng: 115.230000, status: 'todo', title: 'Hospital Kasih Ibu', type: 'Medical A-123' },
		{ id: 5, lat: -8.690000, lng: 115.240000, status: 'next', title: 'Klinik Mata Nusantara', type: 'Medical A-456' }
    ];

    const allMarkers = markers.length > 0 ? markers : defaultMarkers;

    const getMarkerColor = (status: string): string => {
        switch (status) {
            case 'done':
                return '#10b981'; // green
            case 'next':
                return '#3b82f6'; // blue
            case 'anomaly':
                return '#ef4444'; // red
            case 'todo':
            default:
                return '#6b7280'; // gray
        }
    }

    const getMarkerIcon = (status: string) => {
        if (!L) {
            return null;
        }

        const color = getMarkerColor(status);

        return L.divIcon({
            className: 'custom-marker',
            html: `
            <div style="
					width: 16px;
					height: 16px;
					background-color: ${color};
					border: 2px solid white;
					border-radius: 50%;
					box-shadow: 0 2px 4px rgba(0,0,0,0.3);
				"></div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
    };

    onMount(async () => {
        if (browser) {
            // Dynamically import Leaflet only on client side
            const leaflet = await import('leaflet');
            L = leaflet.default;

            // Initialize map centered on Denpasar, Bali
            map = L.map(mapContainer, {
                attributionControl: false,
                zoomControl: true
            }).setView([-8.670458, 115.212631], 13);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add markers
            const markerGroup = L.layerGroup().addTo(map);

            allMarkers.forEach(marker => {
                const leafletMarker = L.marker([marker.lat, marker.lng], {
                    icon: getMarkerIcon(marker.status)
                }).addTo(markerGroup);

                // Add popup with details
                leafletMarker.bindPopup(`
                <div style="font-family: sans-serif;">
						<h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${marker.title}</h3>
						<p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">Type: ${marker.type}</p>
						<p style="margin: 0; font-size: 12px;">
							<span style="
								background-color: ${getMarkerColor(marker.status)}20;
								color: ${getMarkerColor(marker.status)};
								padding: 2px 6px;
								border-radius: 12px;
								font-weight: 500;
								text-transform: capitalize;
							">${marker.status}</span>
						</p>
					</div>
                `);
            });

            // Add sample route line between first few markers
            if (allMarkers.length >= 3) {
                const routeCoords = allMarkers.slice(0, 3).map(m => [m.lat, m.lng]);
                L.polyline(routeCoords, {
                    color: '#3b82f6',
                    weight: 3,
                    opacity: 0.7,
                    dashArray: '10, 10'
                }).addTo(map);
            }

            // Fit map to show all markers
            if (allMarkers.length > 0) {
                const group = new L.featureGroup(markerGroup.getLayers());
                map.fitBounds(group.getBounds().pad(0.1));
            }
        }
    });

    onDestroy(() => {
        if (map) {
            map.remove();
        }
    });
</script>

<div bind:this={mapContainer} class="w-full h-full rounded-lg overflow-hidden" style="height: {height}"></div>

<style>
    :global(.custom-marker) {
        background: transparent !important;
        border: none !important;
    }

    :global(.leaflet-popup-content-wrapper) {
        border-radius: 8px;
    }

    :global(.leaflet-popup-content) {
        margin: 12px;
    }
</style>
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import "leaflet/dist/leaflet.css";

    let { collectionDetails, height = '200px'} = $props();

    let mapContainer: HTMLDivElement;
    let map = $state<any>(null);
    let L: any;
    let currentMarker: any = null; // Track current marker

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
            }).setView([collectionDetails.location.lat, collectionDetails.location.lng], 13);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add markers
            const markerGroup = L.layerGroup().addTo(map);

            currentMarker = L.marker([collectionDetails.location.lat, collectionDetails.location.lng], {
                icon: getMarkerIcon(collectionDetails.status)
            }).addTo(markerGroup);

            // Add popup with details
            currentMarker.bindPopup(`
            <div style="font-family: sans-serif;">
                    <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${collectionDetails.producerName}</h3>
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">Status: Active</p>
                    <p style="margin: 0; font-size: 12px;">Last Collection: 10 minutes ago</p>
                </div>
            `);
        }
    });

    onDestroy(() => {
        if (map) {
            map.remove();
        }
    });

    $effect(() => {
        if (map && collectionDetails) {
            map.setView([collectionDetails.location.lat, collectionDetails.location.lng], 13);

            // Clear existing markers and add new one
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }

            currentMarker = L.marker([collectionDetails.location.lat, collectionDetails.location.lng], {
                icon: getMarkerIcon(collectionDetails.status)
            }).addTo(map);

            currentMarker.bindPopup(`
            <div style="font-family: sans-serif;">
                    <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${collectionDetails.producerName}</h3>
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">Status: Active</p>
                    <p style="margin: 0; font-size: 12px;">Last Collection: 10 minutes ago</p>
                </div>
            `);
        }
    })
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
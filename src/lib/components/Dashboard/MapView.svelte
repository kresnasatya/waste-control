<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import "leaflet/dist/leaflet.css";

    interface Collection {
        id: Number;
        producer: String;
        wasteDetail: String;
        status: String;
        location: {
            lat: Number; 
            lng: Number;
        }
    }

    let { collections = [], height = '400px'}: {
        collections?: Collection[];
        height?: string;
    } = $props();

    let mapContainer: HTMLDivElement;
    let map: any;
    let L: any;

    const allCollections = collections;

    const getMarkerColor = (status: String): String => {
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

    const getMarkerIcon = (status: String) => {
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

            allCollections.forEach(collection => {
                const leafletMarker = L.marker([collection.location.lat, collection.location.lng], {
                    icon: getMarkerIcon(collection.status)
                }).addTo(markerGroup);

                // Add popup with details
                leafletMarker.bindPopup(`
                <div style="font-family: sans-serif;">
						<h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${collection.producer}</h3>
						<p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">Status: Active</p>
						<p style="margin: 0; font-size: 12px;">Last Collection: 10 minutes ago</p>
					</div>
                `);
            });

            // Add sample route line between first few markers
            if (allCollections.length >= 3) {
                const routeCoords = allCollections.slice(0, 3).map(c => [c.location.lat, c.location.lng]);
                L.polyline(routeCoords, {
                    color: '#3b82f6',
                    weight: 3,
                    opacity: 0.7,
                    dashArray: '10, 10'
                }).addTo(map);
            }

            // Fit map to show all markers
            if (allCollections.length > 0) {
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
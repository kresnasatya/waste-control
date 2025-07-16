import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
    const vehiclesUrl = new URL('/api/vehicles', url.origin);
    vehiclesUrl.searchParams.set('page', '1');
    vehiclesUrl.searchParams.set('limit', '5');

    const collectionsUrl = new URL('/api/collections', url.origin);
    collectionsUrl.searchParams.set('page', '1');
    collectionsUrl.searchParams.set('limit', '3');

    try {
        // Use SvelteKit's fetch (which works server-side)
        const [vehiclesResponse, collectionsResponse] = await Promise.allSettled([
            fetch(vehiclesUrl.toString()),
            fetch(collectionsUrl.toString())
        ]);

        // Initial response for vehicle
        let vehiclesData: {
            vehicles: any[];
            links: any;
            meta: any;
            error: string | null;
        } = {
            vehicles: [],
            links: null,
            meta: {
                current_page: 1,
                from: null,
                last_page: 0,
                path: '/api/vehicles',
                per_page: 5,
                to: null,
                total: 0
            },
            error: null,
        }

        if (vehiclesResponse.status === 'fulfilled' && vehiclesResponse.value.ok) {
            const vehiclesResult = await vehiclesResponse.value.json();
            vehiclesData = {
                vehicles: vehiclesResult.data || [],
                links: vehiclesResult.links,
                meta: vehiclesResult.meta,
                error: null
            }
        } else if (vehiclesResponse.status === 'rejected') {
            vehiclesData.error = vehiclesResponse.reason instanceof Error
                ? vehiclesResponse.reason.message
                : 'Failed to load vehicles';
        } else if (vehiclesResponse.status === 'fulfilled') {
            const errorData = await vehiclesResponse.value.json().catch(() => { error: 'Unknown error' });
            vehiclesData.error = errorData.error || `HTTP ${vehiclesResponse.value.status}: ${vehiclesResponse.value.statusText}`;
        }

        // Initial response for collections
        let collectionsData: {
            collections: any[];
            links: any;
            meta: any;
            error: string | null;
        } = {
            collections: [],
            links: null,
            meta: {
                current_page: 1,
                from: null,
                last_page: 0,
                path: '/api/collections',
                per_page: 5,
                to: null,
                total: 0
            },
            error: null,
        }

        if (collectionsResponse.status === 'fulfilled' && collectionsResponse.value.ok) {
            const collectionsResult = await collectionsResponse.value.json();
            collectionsData = {
                collections: collectionsResult.data || [],
                links: collectionsResult.links,
                meta: collectionsResult.meta,
                error: null
            }
        } else if (collectionsResponse.status === 'rejected') {
            collectionsData.error = collectionsResponse.reason instanceof Error
                ? collectionsResponse.reason.message
                : 'Failed to load collections';
        } else if (collectionsResponse.status === 'fulfilled') {
            const errorData = await collectionsResponse.value.json().catch(() => { error: 'Unknown error' });
            collectionsData.error = errorData.error || `HTTP ${collectionsResponse.value.status}: ${collectionsResponse.value.statusText}`;
        }

        return {
            vehicles: vehiclesData.vehicles,
            vehiclesLinks: vehiclesData.links,
            vehiclesMeta: vehiclesData.meta,
            vehiclesError: vehiclesData.error,

            collections: collectionsData.collections,
            collectionsLinks: collectionsData.links,
            collectionsMeta: collectionsData.meta,
            collectionsError: collectionsData.error,
        };

    } catch (error) {
        console.error('Error loading vehicles from API:', error);

        return {
            // Vehicles fallback data
            vehicles: [],
            vehiclesLinks: null,
            vehiclesMeta: {
                current_page: 1,
                from: null,
                last_page: 0,
                path: '/api/vehicles',
                per_page: 5,
                to: null,
                total: 0
            },
            vehiclesError: error instanceof Error ? error.message : 'Failed to load vehicles',
            
            // Collections fallback data
            collections: [],
            collectionsLinks: null,
            collectionsMeta: {
                current_page: 1,
                from: null,
                last_page: 0,
                path: '/api/collections',
                per_page: 3,
                to: null,
                total: 0
            },
            collectionsError: error instanceof Error ? error.message : 'Failed to load collections'
        };
    }
}
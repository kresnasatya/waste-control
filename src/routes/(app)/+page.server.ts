import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '5');
    const status = url.searchParams.get('status');

    // Build the API URL with query parameters
    const apiUrl = new URL('/api/vehicles', url.origin);
    apiUrl.searchParams.set('page', page.toString());
    apiUrl.searchParams.set('limit', limit.toString());

    if (status) {
        apiUrl.searchParams.set('status', status);
    }

    try {
        // Use SvelteKit's fetch (which works server-side)
        const response = await fetch(apiUrl.toString());

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        return {
            vehicles: result.data || [],
            links: result.links,
            meta: result.meta,
            filters: { status }
        };

    } catch (error) {
        console.error('Error loading vehicles from API:', error);

        return {
            vehicles: [],
            links: null,
            meta: {
                current_page: page,
                from: null,
                last_page: 0,
                path: '/api/vehicles',
                per_page: limit,
                to: null,
                total: 0
            },
            filters: { status },
            error: error instanceof Error ? error.message : 'Failed to load vehicles'
        };
    }
}
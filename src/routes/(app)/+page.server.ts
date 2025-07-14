import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '5');
    const status = url.searchParams.get('status');

    try {
        // Build the API URL with query parameters
        const apiUrl = new URL('/api/vehicles', url.origin);
        apiUrl.searchParams.set('page', page.toString());
        apiUrl.searchParams.set('limit', limit.toString());

        if (status) {
            apiUrl.searchParams.set('status', status);
        }

        // Use SvelteKit's fetch (which works server-side)
        const response = await fetch(apiUrl.toString());

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            vehicles: data.vehicles || data,
            pagination: {
                currentPage: page,
                totalPages: data.totalPages || Math.ceil((data.total || 0) / limit),
                total: data.total || 0,
                limit
            },
            filters: {
                status: status || null
            }
        };

    } catch (error) {
        console.error('Error loading vehicles from API:', error);

        return {
            vehicles: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                total: 0,
                limit
            },
            filters: {
                status: status || null
            },
            error: error instanceof Error ? error.message : 'Failed to load vehicles'
        };
    }
}
import type { PaginationLinks, PaginationMeta } from './types';

export function getStatusClass(status: string): string {
    switch (status) {
        case 'next': return 'text-indicator-info';
        case 'anomaly':
        case 'cancelled':
            return 'text-indicator-error';
        case 'done': return 'text-indicator-success';
        case 'todo': return 'text-wwwaste-blue';
        default: return 'text-gray-800';
    }
}

export function generatePaginationLinks(page: number, totalPages: number, baseUrl: string): PaginationLinks {
    const buildUrl = (pageNum: number) => `${baseUrl}?page=${pageNum}`;

    return {
        first: totalPages > 0 ? buildUrl(1) : null,
        last: totalPages > 0 ? buildUrl(totalPages) : null,
        prev: page > 1 ? buildUrl(page - 1) : null,
        next: page < totalPages ? buildUrl(page + 1) : null
    };
}

export function generatePaginationMeta(
    page: number,
    limit: number,
    total: number,
    baseUrl: string
): PaginationMeta {
const totalPages = Math.ceil(total / limit);
const from  = total > 0 ? (page - 1) * limit + 1 : null;
const to = total > 0 ? Math.min(page * limit, total) : null;

return {
    current_page: page,
    from,
    last_page: totalPages,
    path: baseUrl,
    per_page: limit,
    to,
    total
}
}
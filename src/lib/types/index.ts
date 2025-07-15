// Type definitions
interface WasteCollectionData {
    time: string;
    recyclable: number;
    organic: number;
    general: number;
    hazardous: number;
}

interface WasteTypeData {
    category: string;
    percentage: number;
    color: string;
}

// Laravel-style API response interfaces
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
}

export interface PaginatedApiResponse<T> {
    data?: T[];
    links?: PaginationLinks;
    meta?: PaginationMeta;
    error?: string;
}
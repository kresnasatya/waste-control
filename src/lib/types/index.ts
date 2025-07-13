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
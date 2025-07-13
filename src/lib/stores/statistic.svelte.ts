export const realtimeCollectionData: WasteCollectionData[] = $state([
    { time: '01', recyclable: 50, organic: 65, general: 15, hazardous: 55 },
    { time: '02', recyclable: 65, organic: 70, general: 20, hazardous: 70 },
    { time: '03', recyclable: 80, organic: 75, general: 25, hazardous: 85 },
    { time: '04', recyclable: 95, organic: 70, general: 20, hazardous: 100 },
    { time: '05', recyclable: 110, organic: 80, general: 15, hazardous: 110 },
    { time: '06', recyclable: 125, organic: 65, general: 20, hazardous: 105 },
    { time: '07', recyclable: 135, organic: 70, general: 25, hazardous: 100 },
    { time: '08', recyclable: 140, organic: 75, general: 30, hazardous: 105 },
    { time: '09', recyclable: 130, organic: 85, general: 35, hazardous: 100 },
    { time: '10', recyclable: 105, organic: 95, general: 30, hazardous: 90 },
    { time: '11', recyclable: 85, organic: 90, general: 25, hazardous: 75 },
    { time: '12', recyclable: 75, organic: 85, general: 20, hazardous: 70 },
    { time: '13', recyclable: 85, organic: 80, general: 15, hazardous: 60 },
    { time: '14', recyclable: 100, organic: 75, general: 20, hazardous: 50 },
    { time: '15', recyclable: 115, organic: 80, general: 25, hazardous: 25 },
    { time: '16', recyclable: 125, organic: 70, general: 35, hazardous: 10 }
]);

export const wasteTypeDistribution: WasteTypeData[] = $state([
    { category: 'Recyclable', percentage: 48, color: '#4F46E5' },
    { category: 'Organic', percentage: 42, color: '#10B981' },
    { category: 'General', percentage: 7, color: '#F59E0B' },
    { category: 'Hazardous', percentage: 33, color: '#EF4444' }
]);
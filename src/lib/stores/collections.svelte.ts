export const collections = $state([
    {
        id: 1,
        producer: 'Dental Bali',
        wasteDetail: 'Medical A-233',
        status: 'next',
        location: {
            lat: -8.732281557162041, 
            lng: 115.16723202715751
        }
    },
    {
        id: 2,
        producer: 'Clinic Pratama',
        wasteDetail: 'Medical A-331, A-321',
        status: 'next',
        location: {
            lat: -8.785351867383241, 
            lng: 115.23090248141546,
        }
    },
    {
        id: 3,
        producer: 'Vet Global Bali',
        wasteDetail: 'Medical A-331, A-321, A-432',
        status: 'anomaly',
        location: {
            lat: -8.699411301136614, 
            lng: 115.1806370399545
        }
    }
]);
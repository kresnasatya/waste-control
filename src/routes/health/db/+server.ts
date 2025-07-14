import { connect, disconnect, getDB } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET() {
    try {
        await connect();

        const db = await getDB();

        await db.admin().ping();

        const dbStats = await db.stats();

        return json({
            status: 'healthy',
            database: 'mongodb',
            connected: true,
            timestamp: new Date().toISOString(),
            details: {
                collections: dbStats.collections || 0,
                dataSize: dbStats.dataSize || 0,
                storageSize: dbStats.storageSize || 0
            }
            }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
            });
    } catch (error) {
        console.error('MongoDB health check failed:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorCode = (error as any)?.code || 'UNKNOWN';
    
        return json({
            status: 'unhealthy',
            database: 'mongodb',
            connected: false,
            timestamp: new Date().toISOString(),
            error: {
                message: errorMessage,
                code: errorCode
            }
            }, {
            status: 503,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
    } finally {
        // Use your existing disconnect function
        try {
            await disconnect();
        } catch (closeError) {
            console.error('Error closing MongoDB connection:', closeError);
        }
    }
}
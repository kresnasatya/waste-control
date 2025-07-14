import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { collectionService } from '$lib/server/collection.js';

export const GET: RequestHandler = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') ?? '1');
  const limit = parseInt(url.searchParams.get('limit') ?? '10');
  const status = url.searchParams.get('status');
  const vehicleId = url.searchParams.get('vehicleId');
  
  let filter: any = {};
  if (status) filter.status = status;
  if (vehicleId) filter.vehicleId = vehicleId;
  
  const result = await collectionService.getAllCollections(page, limit, Object.keys(filter).length > 0 ? filter : undefined);
  
  if (result.success) {
    return json(result.data);
  }
  
  return json({ error: result.error }, { status: 500 });
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const collectionData = await request.json();
    const result = await collectionService.createCollection(collectionData);
    
    if (result.success) {
      return json(result.data, { status: 201 });
    }
    
    return json({ error: result.error }, { status: 400 });
  } catch (error) {
    return json({ error: 'Invalid JSON data' }, { status: 400 });
  }
};
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
  
  if (result.error) {
    return json({ error: result.error }, { status: 500 });
  }
  
  return json({ 
    data: result.data,
    links: result.links,
    meta: result.meta
  });
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const collectionData = await request.json();
    const result = await collectionService.createCollection(collectionData);
    
    if (result.error) {
      return json({ error: result.error }, { status: 400 });
    }
    
    return json({ data: result.data }, { status: 201 });
  } catch (error) {
    return json({ error: 'Invalid JSON data' }, { status: 400 });
  }
};
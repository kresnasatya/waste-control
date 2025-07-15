import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { vehicleService } from '$lib/server/vehicle.js';

export const GET: RequestHandler = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') ?? '1');
  const limit = parseInt(url.searchParams.get('limit') ?? '10');
  const status = url.searchParams.get('status');
  
  const isValidStatus = (status: string | null): status is 'active' | 'idle' | 'maintenance' => {
    return status === 'active' || status === 'idle' || status === 'maintenance'
  };

  const filter = status && isValidStatus(status) ? { status } : undefined;
  
  const result = await vehicleService.getAllVehicles(page, limit, filter);
  
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
    const vehicleData = await request.json();
    const result = await vehicleService.createVehicle(vehicleData);
    
    if (result.error) {
      return json({ error: result.error }, { status: 400 });
    }
    
    return json({ data: result.data }, { status: 201 });
  } catch (error) {
    return json({ error: 'Invalid JSON data' }, { status: 400 });
  }
};
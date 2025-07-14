import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { vehicleService } from '$lib/server/vehicle.js';

export const GET: RequestHandler = async ({ params }) => {
  const result = await vehicleService.getVehicleById(params.id);
  
  if (result.success) {
    return json(result.data);
  }
  
  return json({ error: result.error }, { status: 404 });
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const updateData = await request.json();
    const result = await vehicleService.updateVehicle(params.id, updateData);
    
    if (result.success) {
      return json(result.data);
    }
    
    return json({ error: result.error }, { status: 404 });
  } catch (error) {
    return json({ error: 'Invalid JSON data' }, { status: 400 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  const result = await vehicleService.deleteVehicle(params.id);
  
  if (result.success) {
    return json({ message: 'Vehicle deleted successfully' });
  }
  
  return json({ error: result.error }, { status: 404 });
};
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { producerService } from '$lib/server/producer.js';

export const GET: RequestHandler = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') ?? '1');
  const limit = parseInt(url.searchParams.get('limit') ?? '10');
  const search = url.searchParams.get('search');
  const city = url.searchParams.get('city');
  
  if (search) {
    const result = await producerService.searchProducers(search);
    if (result.success) {
      return json(result.data);
    }
    return json({ error: result.error }, { status: 500 });
  }
  
  if (city) {
    const result = await producerService.getProducersByCity(city);
    if (result.success) {
      return json(result.data);
    }
    return json({ error: result.error }, { status: 500 });
  }
  
  const result = await producerService.getAllProducers(page, limit);
  
  if (result.success) {
    return json(result.data);
  }
  
  return json({ error: result.error }, { status: 500 });
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const producerData = await request.json();
    const result = await producerService.createProducer(producerData);
    
    if (result.success) {
      return json(result.data, { status: 201 });
    }
    
    return json({ error: result.error }, { status: 400 });
  } catch (error) {
    return json({ error: 'Invalid JSON data' }, { status: 400 });
  }
};
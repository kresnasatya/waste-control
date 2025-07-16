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
    if (result.error) {
      return json({ error: result.error }, { status: 500 });
    }
    return json({ 
      data: result.data,
      links: result.links,
      meta: result.meta
    });
  }
  
  if (city) {
    const result = await producerService.getProducersByCity(city);
    if (result.error) {
      return json({ error: result.error }, { status: 500 });
    }
    return json({ 
      data: result.data,
      links: result.links,
      meta: result.meta
    });
  }
  
  const result = await producerService.getAllProducers(page, limit);
  
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
    const producerData = await request.json();
    const result = await producerService.createProducer(producerData);
    
    if (result.error) {
      return json({ error: result.error }, { status: 400 });
    }
    
    return json(result.data, { status: 201 });
  } catch (error) {
    return json({ error: 'Invalid JSON data' }, { status: 400 });
  }
};
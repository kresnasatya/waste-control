import { Collection as MongoCollection, ObjectId } from 'mongodb';
import { getDB } from './db';
import type { CreateProducer, Producer, UpdateProducer } from './db/schema';
import type { ApiResponse, PaginatedApiResponse } from '$lib/types';
import { generatePaginationLinks, generatePaginationMeta } from '$lib/helper';

export class ProducerService {
  private async getCollection(): Promise<MongoCollection<Producer>> {
    const db = await getDB();
    return db.collection<Producer>('producers');
  }

  async createProducer(producerData: CreateProducer): Promise<ApiResponse<Producer>> {
    try {
      const collection = await this.getCollection();
      const now = new Date();
      
      const producerWithTimestamps: Producer = {
        ...producerData,
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(producerWithTimestamps);
      
      if (result.acknowledged) {
        const createdProducer = await collection.findOne({ _id: result.insertedId });
        return {
          data: createdProducer!,
        };
      }
      
      return {
        error: 'Failed to create producer',
      };
    } catch (error) {
      console.error('Error creating producer:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getProducerById(id: string): Promise<ApiResponse<Producer>> {
    try {
      const collection = await this.getCollection();
      const producer = await collection.findOne({ _id: new ObjectId(id) });
      
      if (producer) {
        return {
          data: producer,
        };
      }
      
      return {
        error: 'Producer not found',
      };
    } catch (error) {
      console.error('Error getting producer:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getAllProducers(page = 1, limit = 10, filter?: Partial<Producer>, baseUrl = '/api/producers'): Promise<PaginatedApiResponse<Producer>> {
    try {
      const collection = await this.getCollection();
      const skip = (page - 1) * limit;
      
      const query = filter ? { ...filter } : {};
      
      const [producers, total] = await Promise.all([
        collection.find(query).skip(skip).limit(limit).toArray(),
        collection.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);
      
      return {
        data: producers,
        links: generatePaginationLinks(page, totalPages, baseUrl),
        meta: generatePaginationMeta(page, limit, total, baseUrl),
      };
    } catch (error) {
      console.error('Error getting producers:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updateProducer(id: string, updateData: UpdateProducer): Promise<ApiResponse<Producer>> {
    try {
      const collection = await this.getCollection();
      const updateDoc = {
        ...updateData,
        updatedAt: new Date(),
      };

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateDoc },
        { returnDocument: 'after' }
      );
      
      if (result) {
        return {
          data: result,
        };
      }
      
      return {
        error: 'Producer not found or update failed',
      };
    } catch (error) {
      console.error('Error updating producer:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deleteProducer(id: string): Promise<ApiResponse<boolean>> {
    try {
      const collection = await this.getCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount > 0) {
        return {
          data: true,
        };
      }
      
      return {
        error: 'Producer not found',
      };
    } catch (error) {
      console.error('Error deleting producer:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async searchProducers(searchTerm: string): Promise<PaginatedApiResponse<Producer>> {
    try {
      const collection = await this.getCollection();
      const producers = await collection.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { address: { $regex: searchTerm, $options: 'i' } },
          { city: { $regex: searchTerm, $options: 'i' } },
          { phone: { $regex: searchTerm, $options: 'i' } }
        ]
      }).toArray();
      
      return {
        data: producers,
      };
    } catch (error) {
      console.error('Error searching producers:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getProducersByCity(city: string): Promise<PaginatedApiResponse<Producer>> {
    try {
      const collection = await this.getCollection();
      const producers = await collection.find({ city }).toArray();
      
      return {
        data: producers,
      };
    } catch (error) {
      console.error('Error getting producers by city:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const producerService = new ProducerService();
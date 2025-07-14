import { Collection as MongoCollection, ObjectId } from 'mongodb';
import type { CreateProducer, DatabaseResponse, PaginatedResponse, Producer, UpdateProducer } from './db/schema';
import { getDB } from './db';

export class ProducerService {
  private async getCollection(): Promise<MongoCollection<Producer>> {
    const db = await getDB();
    return db.collection<Producer>('producers');
  }

  async createProducer(producerData: CreateProducer): Promise<DatabaseResponse<Producer>> {
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
          success: true,
          data: createdProducer!,
        };
      }
      
      return {
        success: false,
        error: 'Failed to create producer',
      };
    } catch (error) {
      console.error('Error creating producer:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getProducerById(id: string): Promise<DatabaseResponse<Producer>> {
    try {
      const collection = await this.getCollection();
      const producer = await collection.findOne({ _id: new ObjectId(id) });
      
      if (producer) {
        return {
          success: true,
          data: producer,
        };
      }
      
      return {
        success: false,
        error: 'Producer not found',
      };
    } catch (error) {
      console.error('Error getting producer:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getAllProducers(page = 1, limit = 10, filter?: Partial<Producer>): Promise<DatabaseResponse<PaginatedResponse<Producer>>> {
    try {
      const collection = await this.getCollection();
      const skip = (page - 1) * limit;
      
      const query = filter ? { ...filter } : {};
      
      const [producers, total] = await Promise.all([
        collection.find(query).skip(skip).limit(limit).toArray(),
        collection.countDocuments(query),
      ]);
      
      return {
        success: true,
        data: {
          items: producers,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error getting producers:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updateProducer(id: string, updateData: UpdateProducer): Promise<DatabaseResponse<Producer>> {
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
          success: true,
          data: result,
        };
      }
      
      return {
        success: false,
        error: 'Producer not found or update failed',
      };
    } catch (error) {
      console.error('Error updating producer:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deleteProducer(id: string): Promise<DatabaseResponse<boolean>> {
    try {
      const collection = await this.getCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount > 0) {
        return {
          success: true,
          data: true,
        };
      }
      
      return {
        success: false,
        error: 'Producer not found',
      };
    } catch (error) {
      console.error('Error deleting producer:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async searchProducers(searchTerm: string): Promise<DatabaseResponse<Producer[]>> {
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
        success: true,
        data: producers,
      };
    } catch (error) {
      console.error('Error searching producers:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getProducersByCity(city: string): Promise<DatabaseResponse<Producer[]>> {
    try {
      const collection = await this.getCollection();
      const producers = await collection.find({ city }).toArray();
      
      return {
        success: true,
        data: producers,
      };
    } catch (error) {
      console.error('Error getting producers by city:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const producerService = new ProducerService();
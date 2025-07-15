import { Collection as MongoCollection, ObjectId } from 'mongodb';
import { getDB } from './db';
import type { Collection, CreateCollection, UpdateCollection } from './db/schema';
import type { ApiResponse, PaginatedApiResponse } from '$lib/types';
import { generatePaginationLinks, generatePaginationMeta } from '$lib/helper';

export class CollectionService {
  private async getCollection(): Promise<MongoCollection<Collection>> {
    const db = await getDB();
    return db.collection<Collection>('collections');
  }

  async createCollection(collectionData: CreateCollection): Promise<ApiResponse<Collection>> {
    try {
      const collection = await this.getCollection();
      const now = new Date();
      
      const collectionWithTimestamps: Collection = {
        ...collectionData,
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(collectionWithTimestamps);
      
      if (result.acknowledged) {
        const createdCollection = await collection.findOne({ _id: result.insertedId });
        return {
          data: createdCollection!,
        };
      }
      
      return {
        error: 'Failed to create collection',
      };
    } catch (error) {
      console.error('Error creating collection:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getCollectionById(id: string): Promise<ApiResponse<Collection>> {
    try {
      const collection = await this.getCollection();
      const doc = await collection.findOne({ _id: new ObjectId(id) });
      
      if (doc) {
        return {
          data: doc,
        };
      }
      
      return {
        error: 'Collection not found',
      };
    } catch (error) {
      console.error('Error getting collection:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getAllCollections(page = 1, limit = 10, filter?: Partial<Collection>, baseUrl = 'api/collections'): Promise<PaginatedApiResponse<Collection>> {
    try {
      const collection = await this.getCollection();
      const skip = (page - 1) * limit;
      
      const query = filter ? { ...filter } : {};
      
      const [collections, total] = await Promise.all([
        collection.find(query).skip(skip).limit(limit).toArray(),
        collection.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);
      
      return {
        data: collections,
        links: generatePaginationLinks(page, totalPages, baseUrl),
        meta: generatePaginationMeta(page, limit, total, baseUrl),
      };
    } catch (error) {
      console.error('Error getting collections:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updateCollection(id: string, updateData: UpdateCollection): Promise<ApiResponse<Collection>> {
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
        error: 'Collection not found or update failed',
      };
    } catch (error) {
      console.error('Error updating collection:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deleteCollection(id: string): Promise<ApiResponse<boolean>> {
    try {
      const collection = await this.getCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount > 0) {
        return {
          data: true,
        };
      }
      
      return {
        error: 'Collection not found',
      };
    } catch (error) {
      console.error('Error deleting collection:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getCollectionsByStatus(status: 'todo' | 'next' | 'done' | 'anomaly'): Promise<ApiResponse<Collection[]>> {
    try {
      const collection = await this.getCollection();
      const collections = await collection.find({ status }).toArray();
      
      return {
        data: collections,
      };
    } catch (error) {
      console.error('Error getting collections by status:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getCollectionsByVehicle(vehicleId: string): Promise<ApiResponse<Collection[]>> {
    try {
      const collection = await this.getCollection();
      const collections = await collection.find({ vehicleId }).toArray();
      
      return {
        data: collections,
      };
    } catch (error) {
      console.error('Error getting collections by vehicle:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async markCollectionCompleted(id: string): Promise<ApiResponse<Collection>> {
    try {
      const collection = await this.getCollection();
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            status: 'done',
            completedTime: new Date(),
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      
      if (result) {
        return {
          data: result,
        };
      }
      
      return {
        error: 'Collection not found',
      };
    } catch (error) {
      console.error('Error marking collection completed:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const collectionService = new CollectionService();
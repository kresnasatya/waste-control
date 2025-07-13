import { Collection as MongoCollection, ObjectId } from 'mongodb';
import { getDB } from './db';
import type { Collection, CreateCollection, DatabaseResponse, PaginatedResponse, UpdateCollection } from './db/schema';

export class CollectionService {
  private async getCollection(): Promise<MongoCollection<Collection>> {
    const db = await getDB();
    return db.collection<Collection>('collections');
  }

  async createCollection(collectionData: CreateCollection): Promise<DatabaseResponse<Collection>> {
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
          success: true,
          data: createdCollection!,
        };
      }
      
      return {
        success: false,
        error: 'Failed to create collection',
      };
    } catch (error) {
      console.error('Error creating collection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getCollectionById(id: string): Promise<DatabaseResponse<Collection>> {
    try {
      const collection = await this.getCollection();
      const doc = await collection.findOne({ _id: new ObjectId(id) });
      
      if (doc) {
        return {
          success: true,
          data: doc,
        };
      }
      
      return {
        success: false,
        error: 'Collection not found',
      };
    } catch (error) {
      console.error('Error getting collection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getAllCollections(page = 1, limit = 10, filter?: Partial<Collection>): Promise<DatabaseResponse<PaginatedResponse<Collection>>> {
    try {
      const collection = await this.getCollection();
      const skip = (page - 1) * limit;
      
      const query = filter ? { ...filter } : {};
      
      const [collections, total] = await Promise.all([
        collection.find(query).skip(skip).limit(limit).toArray(),
        collection.countDocuments(query),
      ]);
      
      return {
        success: true,
        data: {
          items: collections,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error getting collections:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updateCollection(id: string, updateData: UpdateCollection): Promise<DatabaseResponse<Collection>> {
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
        error: 'Collection not found or update failed',
      };
    } catch (error) {
      console.error('Error updating collection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deleteCollection(id: string): Promise<DatabaseResponse<boolean>> {
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
        error: 'Collection not found',
      };
    } catch (error) {
      console.error('Error deleting collection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getCollectionsByStatus(status: 'todo' | 'next' | 'done' | 'anomaly'): Promise<DatabaseResponse<Collection[]>> {
    try {
      const collection = await this.getCollection();
      const collections = await collection.find({ status }).toArray();
      
      return {
        success: true,
        data: collections,
      };
    } catch (error) {
      console.error('Error getting collections by status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getCollectionsByVehicle(vehicleId: string): Promise<DatabaseResponse<Collection[]>> {
    try {
      const collection = await this.getCollection();
      const collections = await collection.find({ vehicleId }).toArray();
      
      return {
        success: true,
        data: collections,
      };
    } catch (error) {
      console.error('Error getting collections by vehicle:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async markCollectionCompleted(id: string): Promise<DatabaseResponse<Collection>> {
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
          success: true,
          data: result,
        };
      }
      
      return {
        success: false,
        error: 'Collection not found',
      };
    } catch (error) {
      console.error('Error marking collection completed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const collectionService = new CollectionService();
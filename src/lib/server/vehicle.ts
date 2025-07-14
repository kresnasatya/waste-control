import { Collection as MongoCollection, ObjectId } from 'mongodb';
import { getDB } from './db';
import type { CreateVehicle, DatabaseResponse, PaginatedResponse, UpdateVehicle, Vehicle } from './db/schema';

export class VehicleService {
  private async getCollection(): Promise<MongoCollection<Vehicle>> {
    const db = await getDB();
    return db.collection<Vehicle>('vehicles');
  }

  async createVehicle(vehicleData: CreateVehicle): Promise<DatabaseResponse<Vehicle>> {
    try {
      const collection = await this.getCollection();
      const now = new Date();
      
      const vehicleWithTimestamps: Vehicle = {
        ...vehicleData,
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(vehicleWithTimestamps);
      
      if (result.acknowledged) {
        const createdVehicle = await collection.findOne({ _id: result.insertedId });
        return {
          success: true,
          data: createdVehicle!,
        };
      }
      
      return {
        success: false,
        error: 'Failed to create vehicle',
      };
    } catch (error) {
      console.error('Error creating vehicle:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getVehicleById(id: string): Promise<DatabaseResponse<Vehicle>> {
    try {
      const collection = await this.getCollection();
      const vehicle = await collection.findOne({ _id: new ObjectId(id) });
      
      if (vehicle) {
        return {
          success: true,
          data: vehicle,
        };
      }
      
      return {
        success: false,
        error: 'Vehicle not found',
      };
    } catch (error) {
      console.error('Error getting vehicle:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getVehicleByVehicleId(vehicleId: string): Promise<DatabaseResponse<Vehicle>> {
    try {
      const collection = await this.getCollection();
      const vehicle = await collection.findOne({ vehicleId });
      
      if (vehicle) {
        return {
          success: true,
          data: vehicle,
        };
      }
      
      return {
        success: false,
        error: 'Vehicle not found',
      };
    } catch (error) {
      console.error('Error getting vehicle by vehicleId:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getAllVehicles(page = 1, limit = 10, filter?: Partial<Vehicle>): Promise<DatabaseResponse<PaginatedResponse<Vehicle>>> {
    try {
      const collection = await this.getCollection();
      const skip = (page - 1) * limit;
      
      const query = filter ? { ...filter } : {};
      
      const [vehicles, total] = await Promise.all([
        collection.find(query).skip(skip).limit(limit).toArray(),
        collection.countDocuments(query),
      ]);
      
      return {
        success: true,
        data: {
          items: vehicles,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error getting vehicles:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updateVehicle(id: string, updateData: UpdateVehicle): Promise<DatabaseResponse<Vehicle>> {
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
        error: 'Vehicle not found or update failed',
      };
    } catch (error) {
      console.error('Error updating vehicle:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deleteVehicle(id: string): Promise<DatabaseResponse<boolean>> {
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
        error: 'Vehicle not found',
      };
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getActiveVehicles(): Promise<DatabaseResponse<Vehicle[]>> {
    try {
      const collection = await this.getCollection();
      const vehicles = await collection.find({ status: 'active' }).toArray();
      
      return {
        success: true,
        data: vehicles,
      };
    } catch (error) {
      console.error('Error getting active vehicles:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const vehicleService = new VehicleService();
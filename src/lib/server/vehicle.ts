import { Collection as MongoCollection, ObjectId } from 'mongodb';
import { getDB } from './db';
import { generatePaginationLinks, generatePaginationMeta } from '$lib/helper';
import type { CreateVehicle, UpdateVehicle, Vehicle } from './db/schema';
import type { ApiResponse, PaginatedApiResponse } from '$lib/types';

export class VehicleService {
  private async getCollection(): Promise<MongoCollection<Vehicle>> {
    const db = await getDB();
    return db.collection<Vehicle>('vehicles');
  }

  async createVehicle(vehicleData: CreateVehicle): Promise<ApiResponse<Vehicle>> {
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
          data: createdVehicle!,
        };
      }
      
      return {
        error: 'Failed to create vehicle',
      };
    } catch (error) {
      console.error('Error creating vehicle:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getVehicleById(id: string): Promise<ApiResponse<Vehicle>> {
    try {
      const collection = await this.getCollection();
      const vehicle = await collection.findOne({ _id: new ObjectId(id) });
      
      if (vehicle) {
        return {
          data: vehicle,
        };
      }
      
      return {
        error: 'Vehicle not found',
      };
    } catch (error) {
      console.error('Error getting vehicle:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getVehicleByVehicleId(vehicleId: string): Promise<ApiResponse<Vehicle>> {
    try {
      const collection = await this.getCollection();
      const vehicle = await collection.findOne({ vehicleId });
      
      if (vehicle) {
        return {
          data: vehicle,
        };
      }
      
      return {
        error: 'Vehicle not found',
      };
    } catch (error) {
      console.error('Error getting vehicle by vehicleId:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getAllVehicles(page = 1, limit = 10, filter?: Partial<Vehicle>, baseUrl = '/api/vehicles'): Promise<PaginatedApiResponse<Vehicle>> {
    try {
      const collection = await this.getCollection();
      const skip = (page - 1) * limit;
      
      const query = filter ? { ...filter } : {};
      
      const [vehicles, total] = await Promise.all([
        collection.find(query).skip(skip).limit(limit).toArray(),
        collection.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);
      
      return {
        data: vehicles,
        links: generatePaginationLinks(page, totalPages, baseUrl),
        meta: generatePaginationMeta(page, limit, total, baseUrl),
      };
    } catch (error) {
      console.error('Error getting vehicles:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updateVehicle(id: string, updateData: UpdateVehicle): Promise<ApiResponse<Vehicle>> {
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
        error: 'Vehicle not found or update failed',
      };
    } catch (error) {
      console.error('Error updating vehicle:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deleteVehicle(id: string): Promise<ApiResponse<boolean>> {
    try {
      const collection = await this.getCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount > 0) {
        return {
          message: 'Vehicle successfuly deleted',
        };
      }
      
      return {
        error: 'Vehicle not found',
      };
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getActiveVehicles(): Promise<ApiResponse<Vehicle[]>> {
    try {
      const collection = await this.getCollection();
      const vehicles = await collection.find({ status: 'active' }).toArray();
      
      return {
        data: vehicles,
      };
    } catch (error) {
      console.error('Error getting active vehicles:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const vehicleService = new VehicleService();
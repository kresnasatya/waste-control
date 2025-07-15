import type { ObjectId } from "mongodb";

export interface Location {
    lat: number;
    lng: number;
}

export interface Vehicle {
    _id?: ObjectId;
    vehicleId: string;
    driver: string;
    totalStops: number;
    stopsDone: number;
    currentLocation: Location;
    status: 'active' | 'idle' | 'maintenance';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Collection {
    _id?: ObjectId;
    id: string;
    producer: string;
    wasteDetail: string;
    status: 'todo' | 'next' | 'done' | 'anomaly';
    location: Location;
    scheduledTime: Date;
    completedTime?: Date;
    vehicleId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Producer {
    _id?: ObjectId;
    name: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
    status: string;
    location: Location;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateVehicle = Omit<Vehicle, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateVehicle = Partial<CreateVehicle>;

export type CreateCollection = Omit<Collection, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateCollection = Partial<CreateCollection>;

export type CreateProducer = Omit<Producer, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateProducer = Partial<CreateProducer>;
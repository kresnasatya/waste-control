import { Db } from 'mongodb';
import { connect, disconnect, getDB } from './server/db';
import type { Collection, Producer, Vehicle } from './server/db/schema';

export class MongoSeeder {
  private db: Db | null = null;

  async connect(): Promise<void> {
    try {
      await connect();
      this.db = await getDB();
      console.log('Connected to MongoDB using existing connection');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
  }

  private getRandomLocation(): { lat: number; lng: number } {
    // Bali coordinates range
    const lat = -8.3405 + Math.random() * 0.5; // Approx Bali latitude range
    const lng = 115.0919 + Math.random() * 0.5; // Approx Bali longitude range
    return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
  }

  private getRandomDate(daysBack: number = 30): Date {
    const now = new Date();
    const pastDate = new Date(now.getTime() - (Math.random() * daysBack * 24 * 60 * 60 * 1000));
    return pastDate;
  }

  private generateVehicles(): Omit<Vehicle, '_id' | 'createdAt' | 'updatedAt'>[] {
    const drivers = [
      'Wayan Nico',
      'Nyoman Bagiada', 
      'Saipul Rahmat',
      'Made Surya',
      'Aditya Ramadhan',
      'Ketut Suwitra',
      'Putu Agung',
      'Gede Wirawan'
    ];

    const vehicleIds = [
      'DK 1289 BUY',
      'DK 8080 YU',
      'DK 0223 AHS',
      'DK 4567 XYZ',
      'DK 9876 ABC',
      'DK 5432 DEF',
      'DK 1111 GHI',
      'DK 2222 JKL'
    ];

    const statuses: Array<'active' | 'idle' | 'maintenance'> = ['active', 'idle', 'maintenance'];

    return vehicleIds.map((vehicleId, index) => ({
      vehicleId,
      driver: drivers[index],
      totalStops: Math.floor(Math.random() * 10) + 1,
      stopsDone: Math.floor(Math.random() * 5),
      currentLocation: this.getRandomLocation(),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
  }

  private generateProducers(): Omit<Producer, '_id' | 'createdAt' | 'updatedAt'>[] {
    const producers = [
      {
        name: 'Dental Bali',
        address: 'Jl. Gatot Subroto Barat No.466 448',
        city: 'Kota Denpasar',
        province: 'Bali',
        postalCode: '80116',
        phone: '+62 8917788123'
      },
      {
        name: 'Clinic Pratama',
        address: 'Jl. Sunset Road No.123',
        city: 'Kuta',
        province: 'Bali',
        postalCode: '80361',
        phone: '+62 8123456789'
      },
      {
        name: 'Vet Global Bali',
        address: 'Jl. Monkey Forest Road No.45',
        city: 'Ubud',
        province: 'Bali',
        postalCode: '80571',
        phone: '+62 8234567890'
      },
      {
        name: 'RSUD Wangaya',
        address: 'Jl. Kartini No.133',
        city: 'Denpasar',
        province: 'Bali',
        postalCode: '80232',
        phone: '+62 8345678901'
      },
      {
        name: 'Kimia Farma Apotek',
        address: 'Jl. Diponegoro No.78',
        city: 'Singaraja',
        province: 'Bali',
        postalCode: '81116',
        phone: '+62 8456789012'
      },
      {
        name: 'Lab Klinik Prodia',
        address: 'Jl. Teuku Umar No.234',
        city: 'Denpasar',
        province: 'Bali',
        postalCode: '80113',
        phone: '+62 8567890123'
      },
      {
        name: 'RS Surya Husadha',
        address: 'Jl. Pulau Serangan No.9',
        city: 'Denpasar',
        province: 'Bali',
        postalCode: '80114',
        phone: '+62 8678901234'
      },
      {
        name: 'Tzu Chi Hospital',
        address: 'Jl. Raya Kapal No.168',
        city: 'Mengwi',
        province: 'Bali',
        postalCode: '80351',
        phone: '+62 8789012345'
      }
    ];

    return producers.map(producer => ({
      ...producer,
      status: Math.random() > 0.8 ? 'inactive' : 'active',
      location: this.getRandomLocation()
    }));
  }

  private generateCollections(vehicleIds: string[], producerNames: string[]): Omit<Collection, '_id' | 'createdAt' | 'updatedAt'>[] {
    const wasteTypes = [
      'Medical A-233',
      'Medical A-331',
      'Medical A-321', 
      'Medical A-432',
      'Infectious B-204',
      'Pharmaceutical C-123',
      'Sharps D-456',
      'Pathological E-789'
    ];

    const statuses: Array<'todo' | 'next' | 'done' | 'anomaly'> = ['todo', 'next', 'done', 'anomaly'];
    
    const collections: Omit<Collection, '_id' | 'createdAt' | 'updatedAt'>[] = [];

    // Generate 25 collections
    for (let i = 0; i < 25; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const scheduledTime = this.getRandomDate(7); // Within last 7 days
      
      const collection: Omit<Collection, '_id' | 'createdAt' | 'updatedAt'> = {
        id: `COL-${String(i + 1).padStart(4, '0')}`,
        producer: producerNames[Math.floor(Math.random() * producerNames.length)],
        wasteDetail: wasteTypes[Math.floor(Math.random() * wasteTypes.length)] + 
                    (Math.random() > 0.7 ? ', ' + wasteTypes[Math.floor(Math.random() * wasteTypes.length)] : ''),
        status,
        location: this.getRandomLocation(),
        scheduledTime,
        vehicleId: vehicleIds[Math.floor(Math.random() * vehicleIds.length)]
      };

      // Add completion time if status is 'done'
      if (status === 'done') {
        collection.completedTime = new Date(scheduledTime.getTime() + Math.random() * 24 * 60 * 60 * 1000);
      }

      collections.push(collection);
    }

    return collections;
  }

  async clearCollections(): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    try {
      await this.db.collection('vehicles').deleteMany({});
      await this.db.collection('producers').deleteMany({});
      await this.db.collection('collections').deleteMany({});
      console.log('Cleared existing data');
    } catch (error) {
      console.error('Error clearing collections:', error);
      throw error;
    }
  }

  async seedVehicles(): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    try {
      const vehicles = this.generateVehicles();
      const vehiclesWithTimestamps = vehicles.map(vehicle => ({
        ...vehicle,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      const result = await this.db.collection<Vehicle>('vehicles').insertMany(vehiclesWithTimestamps);
      console.log(`Inserted ${result.insertedCount} vehicles`);
    } catch (error) {
      console.error('Error seeding vehicles:', error);
      throw error;
    }
  }

  async seedProducers(): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    try {
      const producers = this.generateProducers();
      const producersWithTimestamps = producers.map(producer => ({
        ...producer,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      const result = await this.db.collection<Producer>('producers').insertMany(producersWithTimestamps);
      console.log(`Inserted ${result.insertedCount} producers`);
    } catch (error) {
      console.error('Error seeding producers:', error);
      throw error;
    }
  }

  async seedCollections(): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    try {
      // Get existing vehicle IDs and producer names for references
      const vehicles = await this.db.collection<Vehicle>('vehicles').find({}).toArray();
      const producers = await this.db.collection<Producer>('producers').find({}).toArray();

      if (vehicles.length === 0 || producers.length === 0) {
        throw new Error('Vehicles and producers must be seeded first');
      }

      const vehicleIds = vehicles.map(v => v.vehicleId);
      const producerNames = producers.map(p => p.name);

      const collections = this.generateCollections(vehicleIds, producerNames);
      const collectionsWithTimestamps = collections.map(collection => ({
        ...collection,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      const result = await this.db.collection<Collection>('collections').insertMany(collectionsWithTimestamps);
      console.log(`Inserted ${result.insertedCount} collections`);
    } catch (error) {
      console.error('Error seeding collections:', error);
      throw error;
    }
  }

  async seedAll(): Promise<void> {
    try {
      console.log('Starting database seeding...');
      
      await this.connect();
      await this.clearCollections();
      
      await this.seedVehicles();
      await this.seedProducers();
      await this.seedCollections();
      
      console.log('Database seeding completed successfully!');
    } catch (error) {
      console.error('Error during seeding:', error);
      throw error;
    }
  }

  async createIndexes(): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    try {
      // Create indexes for better performance
      await this.db.collection('vehicles').createIndex({ vehicleId: 1 }, { unique: true });
      await this.db.collection('vehicles').createIndex({ status: 1 });
      
      await this.db.collection('producers').createIndex({ name: 1 });
      await this.db.collection('producers').createIndex({ city: 1 });
      await this.db.collection('producers').createIndex({ status: 1 });
      
      await this.db.collection('collections').createIndex({ id: 1 }, { unique: true });
      await this.db.collection('collections').createIndex({ status: 1 });
      await this.db.collection('collections').createIndex({ vehicleId: 1 });
      await this.db.collection('collections').createIndex({ producer: 1 });
      await this.db.collection('collections').createIndex({ scheduledTime: 1 });

      console.log('Database indexes created');
    } catch (error) {
      console.error('Error creating indexes:', error);
      throw error;
    }
  }
}

// CLI execution script
async function main() {
  const seeder = new MongoSeeder();
  
  try {
    await seeder.seedAll();
    await seeder.createIndexes();
    await seeder.disconnect();
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

main();
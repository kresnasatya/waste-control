import { Db, MongoClient } from 'mongodb';
import { MONGO_URL } from '$env/static/private';

const client = new MongoClient(MONGO_URL);

export async function connect(): Promise<void> {
    await client.connect();
}

export async function disconnect(): Promise<void> {
    await client.close();
}

export async function getDB(): Promise<Db> {
    return client.db();
}
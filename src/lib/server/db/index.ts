import { Db, MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';
const { MONGO_URL } = env;

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
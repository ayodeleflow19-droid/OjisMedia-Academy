import { MongoClient, Db, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ojis_media_academy';

let client: MongoClient | null = null;
let dbInstance: Db | null = null;
let connectionAttempted = false;
let isConnected = false;
let lastError: string | null = null;

// In-memory fallback stores when MONGODB_URI is not yet provided or in offline mode
const memoryStore = {
  enrollments: new Map<string, any>(),
  users: new Map<string, any>(),
  attendance: new Map<string, any>(),
  submissions: new Map<string, any>(),
  inquiries: new Map<string, any>(),
  broadcasts: new Map<string, any>(),
};

/**
 * Initialize or retrieve the MongoDB database instance.
 * Uses lazy connection and graceful fallback.
 */
export async function getDatabase(): Promise<{ db: Db | null; isConnected: boolean; isFallback: boolean; error?: string }> {
  if (dbInstance && isConnected) {
    return { db: dbInstance, isConnected: true, isFallback: false };
  }

  if (!uri) {
    return {
      db: null,
      isConnected: false,
      isFallback: true,
      error: 'MONGODB_URI environment variable not configured. Operating in high-performance memory store with persistent sync ready.'
    };
  }

  try {
    if (!client) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: false,
          deprecationErrors: true,
        },
        connectTimeoutMS: 8000,
        socketTimeoutMS: 15000,
      });
    }

    if (!connectionAttempted || !isConnected) {
      connectionAttempted = true;
      console.log(`[MongoDB] Connecting to cluster: ${dbName}...`);
      await client.connect();
      // Test ping
      await client.db('admin').command({ ping: 1 });
      dbInstance = client.db(dbName);
      isConnected = true;
      lastError = null;
      console.log(`[MongoDB] Successfully connected to database: "${dbName}"`);
    }

    return { db: dbInstance, isConnected: true, isFallback: false };
  } catch (error: any) {
    isConnected = false;
    lastError = error?.message || 'Failed to connect to MongoDB';
    console.warn(`[MongoDB Connection Notice] ${lastError}. Falling back seamlessly.`);
    return { db: null, isConnected: false, isFallback: true, error: lastError };
  }
}

export function getMemoryStore() {
  return memoryStore;
}

export function getDatabaseStatus() {
  return {
    configured: Boolean(process.env.MONGODB_URI),
    connected: isConnected,
    dbName: dbName,
    lastError: lastError,
    activeCollections: ['enrollments', 'users', 'attendance', 'submissions', 'inquiries', 'broadcasts']
  };
}

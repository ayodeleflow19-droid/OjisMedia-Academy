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
  direct_messages: new Map<string, any>(),
};

let lastAttemptTime = 0;
const RETRY_INTERVAL_MS = 15000;

/**
 * Initialize or retrieve the MongoDB database instance.
 * Uses lazy connection, rapid timeouts, and graceful fallback.
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
      error: 'MONGODB_URI environment variable not configured. Set MONGODB_URI in Settings to connect to your MongoDB cluster.'
    };
  }

  const now = Date.now();
  if (lastError && (now - lastAttemptTime < RETRY_INTERVAL_MS)) {
    return { db: null, isConnected: false, isFallback: true, error: lastError };
  }

  try {
    lastAttemptTime = now;
    if (!client) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 4000,
        connectTimeoutMS: 4000,
        socketTimeoutMS: 8000,
      });
    }

    console.log(`[MongoDB] Connecting to cluster...`);
    await client.connect();
    // Test ping
    await client.db('admin').command({ ping: 1 });
    dbInstance = client.db(dbName);
    isConnected = true;
    lastError = null;
    console.log(`[MongoDB] Successfully connected to database: "${dbName}"`);

    return { db: dbInstance, isConnected: true, isFallback: false };
  } catch (error: any) {
    isConnected = false;
    dbInstance = null;
    if (client) {
      try { await client.close(); } catch (_) {}
      client = null;
    }
    lastError = error?.message || 'Failed to connect to MongoDB cluster.';
    console.warn(`[MongoDB Notice] ${lastError}`);
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

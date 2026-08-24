import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ojis_media_academy';

let client: MongoClient | null = null;
let dbInstance: Db | null = null;
let isConnected = false;
let lastError: string | null = null;

// In-memory fallback stores when MONGODB_URI is not yet provided or in offline mode
const memoryStore = {
  enrollments: new Map<string, any>(),
  users: new Map<string, any>(),
  categories: new Map<string, any>(),
  courses: new Map<string, any>(),
  attendance: new Map<string, any>(),
  submissions: new Map<string, any>(),
  inquiries: new Map<string, any>(),
  broadcasts: new Map<string, any>(),
  direct_messages: new Map<string, any>(),
};

let lastAttemptTime = 0;
const RETRY_INTERVAL_MS = 60000; // 1 minute backoff on connection failures

/**
 * Format MongoDB error messages to be clean and informative
 */
function formatDbErrorMessage(err: any): string {
  const msg = err?.message || String(err);
  if (msg.includes('SSL routines') || msg.includes('alert number 80') || msg.includes('tlsv1 alert')) {
    return 'MongoDB Atlas TLS handshake rejected. Ensure MongoDB Atlas IP Access List allows 0.0.0.0/0 and special characters in credentials are URL-encoded.';
  }
  if (msg.includes('bad auth') || msg.includes('Authentication failed')) {
    return 'MongoDB Authentication failed. Verify username and password in MONGODB_URI.';
  }
  if (msg.includes('ETIMEDOUT') || msg.includes('serverSelectionTimeoutMS')) {
    return 'MongoDB connection timed out. Check network connectivity and cluster status.';
  }
  return msg;
}

/**
 * Initialize or retrieve the MongoDB database instance.
 * Uses lazy connection, rapid timeouts, and graceful fallback.
 */
export async function getDatabase(): Promise<{ db: Db | null; isConnected: boolean; isFallback: boolean; error?: string }> {
  if (dbInstance && isConnected) {
    return { db: dbInstance, isConnected: true, isFallback: false };
  }

  if (!uri || uri.trim() === '' || uri.includes('MY_MONGODB_URI')) {
    return {
      db: null,
      isConnected: false,
      isFallback: true,
      error: 'MONGODB_URI not configured. Operating with high-speed in-memory store.'
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
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
        socketTimeoutMS: 5000,
        family: 4, // Force IPv4 DNS resolution to prevent cloud container TLS alert 80
        retryWrites: true,
      });
    }

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
    
    lastError = formatDbErrorMessage(error);
    console.log(`[Database Notice] ${lastError} (Operating in fallback memory mode)`);
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
    activeCollections: ['enrollments', 'users', 'categories', 'courses', 'attendance', 'submissions', 'inquiries', 'broadcasts']
  };
}

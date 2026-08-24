import { MongoClient, Db } from 'mongodb';
import { SEED_CATEGORIES, SEED_COURSES } from './seedData';

function cleanMongoUri(rawUri?: string): string | undefined {
  if (!rawUri) return undefined;
  let cleaned = rawUri.trim();
  // Strip accidental angle brackets from password: :<password>@ -> :password@
  cleaned = cleaned.replace(/:<([^>]+)>@/, ':$1@');
  return cleaned;
}

export function cleanDbName(rawName?: string): string {
  if (!rawName) return 'ojis_media_academy';
  let cleaned = rawName.trim();
  // If user accidentally put their username or auth string e.g. "ayodeleflow19_db_user@admin" or "admin"
  if (cleaned.includes('@') || cleaned === 'admin' || cleaned === 'local' || cleaned === 'sample_mflix') {
    return 'ojis_media_academy';
  }
  return cleaned;
}

const rawUri = process.env.MONGODB_URI;
const uri = cleanMongoUri(rawUri);
const dbName = cleanDbName(process.env.MONGODB_DB_NAME);

let client: MongoClient | null = null;
let dbInstance: Db | null = null;
let isConnected = false;
let lastError: string | null = null;

// Initialize categories map with default seed
const initialCategoriesMap = new Map<string, any>();
SEED_CATEGORIES.forEach((cat) => {
  initialCategoriesMap.set(cat.id, { ...cat });
});

// Initialize courses map with default seed
const initialCoursesMap = new Map<string, any>();
SEED_COURSES.forEach((course) => {
  initialCoursesMap.set(course.id, { ...course });
});

// In-memory fallback stores when MONGODB_URI is not yet provided or in offline mode
const memoryStore = {
  enrollments: new Map<string, any>(),
  users: new Map<string, any>(),
  categories: initialCategoriesMap,
  courses: initialCoursesMap,
  attendance: new Map<string, any>(),
  submissions: new Map<string, any>(),
  inquiries: new Map<string, any>(),
  broadcasts: new Map<string, any>(),
  direct_messages: new Map<string, any>(),
};

let lastAttemptTime = 0;
const RETRY_INTERVAL_MS = 60000; // 1 minute backoff on connection failures

/**
 * Seed initial categories and courses into MongoDB if collections are empty
 */
async function seedMongoIfEmpty(db: Db) {
  try {
    const categoriesCount = await db.collection('categories').countDocuments({});
    if (categoriesCount === 0) {
      await db.collection('categories').insertMany(SEED_CATEGORIES.map(c => ({ ...c })));
      console.log(`[MongoDB] Seeded ${SEED_CATEGORIES.length} default categories.`);
    }

    const coursesCount = await db.collection('courses').countDocuments({});
    if (coursesCount === 0) {
      await db.collection('courses').insertMany(SEED_COURSES.map(c => ({ ...c })));
      console.log(`[MongoDB] Seeded ${SEED_COURSES.length} default courses.`);
    }
  } catch (seedErr) {
    console.warn('[MongoDB] Notice during initial collection seeding:', seedErr);
  }
}

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
let currentUri: string | undefined = undefined;

export async function getDatabase(): Promise<{ db: Db | null; isConnected: boolean; isFallback: boolean; error?: string }> {
  const activeUri = cleanMongoUri(process.env.MONGODB_URI);
  const activeDbName = cleanDbName(process.env.MONGODB_DB_NAME);

  // If URI changed, reset client
  if (currentUri !== activeUri && client) {
    try { await client.close(); } catch (_) {}
    client = null;
    dbInstance = null;
    isConnected = false;
    lastError = null;
  }
  currentUri = activeUri;

  if (dbInstance && isConnected) {
    return { db: dbInstance, isConnected: true, isFallback: false };
  }

  if (!activeUri || activeUri.trim() === '' || activeUri.includes('MY_MONGODB_URI')) {
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
      client = new MongoClient(activeUri, {
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
    dbInstance = client.db(activeDbName);
    isConnected = true;
    lastError = null;
    console.log(`[MongoDB] Successfully connected to database: "${activeDbName}"`);

    // Ensure initial categories and courses exist in DB
    await seedMongoIfEmpty(dbInstance);

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
  const activeDbName = cleanDbName(process.env.MONGODB_DB_NAME);
  return {
    configured: Boolean(process.env.MONGODB_URI),
    connected: isConnected,
    dbName: activeDbName,
    lastError: lastError,
    activeCollections: ['enrollments', 'users', 'categories', 'courses', 'attendance', 'submissions', 'inquiries', 'broadcasts']
  };
}

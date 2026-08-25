import { MongoClient, Db } from 'mongodb';
import { SEED_CATEGORIES, SEED_COURSES } from './seedData';

export function cleanMongoUri(rawUri?: string): string | undefined {
  if (!rawUri) return undefined;
  let cleaned = rawUri.trim();
  // Strip enclosing quotes if user copied them with quotes
  cleaned = cleaned.replace(/^['"]+|['"]+$/g, '');
  // Strip accidental angle brackets from password: :<password>@ -> :password@
  cleaned = cleaned.replace(/:<([^>]+)>@/, ':$1@');
  return cleaned;
}

export function cleanDbName(rawName?: string): string {
  if (!rawName) return 'ojis_media_academy';
  let cleaned = rawName.trim().replace(/^['"]+|['"]+$/g, '');
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

// Initial Academy Users including Master Admin and Registered Student ibileafrica@gmail.com
export const SEED_USERS = [
  {
    id: 'usr-master-adm-001',
    role: 'admin',
    name: 'Ayodele (Master Administrator)',
    email: 'ayodeleflow19@gmail.com',
    phone: '+234 800 000 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-MASTER-ADM-001',
    joinedDate: 'Academy Founding Council 2026',
    status: 'Verified',
    isVerified: true,
    bio: 'Master Executive Director & Chancellor of OJIS Media Academy. Full authority across all academic departments, student registries, and facility operations.',
    adminDetails: {
      department: 'Academic Board',
      clearanceLevel: 'Master Executive Director & Chancellor',
      authorizedLocations: ['Lagos Ikeja Main Studio', 'Lekki Annex Hub', 'Online Cloud Campus', 'Executive Studio Soundstage'],
    },
    directMessages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'usr-std-ibile-001',
    role: 'student',
    name: 'Ibile Africa',
    email: 'ibileafrica@gmail.com',
    phone: '+234 812 000 7890',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-STD-2026-901',
    joinedDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    isVerified: true,
    bio: 'Creative media student registered for Advanced Video Editing, Cinematography and Storytelling.',
    studentDetails: {
      enrolledCourseId: 'video-editing-color',
      enrolledCourseTitle: 'Advanced Video Editing & Color Grading',
      cohort: 'April 2026 Cohort (Starts Apr 6)',
      learningMode: 'Physical',
      attendancePercentage: 100,
      completedModules: 0,
      totalModules: 12,
      assignedInstructor: 'Engr. Christopher Daniels',
      nextClassDate: 'Orientation: April 4th at 11:00 AM (Studio Lab 1)',
      tuitionStatus: 'Paid in Full',
    },
    directMessages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'usr-adm-002',
    role: 'admin',
    name: 'Dr. Victoria Morgan',
    email: 'admin.morgan@ojismedia.academy',
    phone: '+234 803 123 4567',
    identifierCode: 'OJIS-ADM-002',
    joinedDate: 'February 2025',
    status: 'Verified',
    isVerified: true,
    adminDetails: {
      department: 'Admissions',
      clearanceLevel: 'Dean / Director',
      authorizedLocations: ['Lagos Ikeja Main Studio', 'Online Cloud Campus'],
    },
    directMessages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'usr-fac-001',
    role: 'instructor',
    name: 'Engr. Christopher Daniels',
    email: 'c.daniels@ojismedia.academy',
    phone: '+234 812 770 1928',
    identifierCode: 'OJIS-FAC-014',
    joinedDate: 'January 2024',
    status: 'Verified',
    isVerified: true,
    instructorDetails: {
      title: 'Lead Post-Production Director & Colorist',
      department: 'Video Editing & Color Grading',
      specialization: 'DaVinci Resolve Studio & Premiere Pro Workflow',
      yearsOfExperience: 11,
      activeBatches: ['April 2026 Morning Batch', 'Weekend Masterclass Batch B'],
      assignedStudentsCount: 38,
      rating: 4.95,
      officeHours: 'Tues & Thurs, 2:00 PM - 5:00 PM',
      canCreateCourses: true,
    },
    directMessages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'usr-std-001',
    role: 'student',
    name: 'Adeola Williams',
    email: 'adeola.w@ojismedia.student',
    phone: '+234 802 918 3491',
    identifierCode: 'OJIS-STD-2026-081',
    joinedDate: 'March 2026',
    status: 'Active',
    isVerified: true,
    studentDetails: {
      enrolledCourseId: 'cinematography-filmmaking',
      enrolledCourseTitle: 'Professional Filmmaking & Cinematography',
      cohort: 'April 2026 Cohort (Starts Apr 6)',
      learningMode: 'Physical',
      attendancePercentage: 94,
      completedModules: 4,
      totalModules: 12,
      assignedInstructor: 'Adekunle Alabi',
      nextClassDate: 'Tomorrow at 10:00 AM (Main Soundstage A)',
      tuitionStatus: 'Paid in Full',
    },
    directMessages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Initialize users map with default seed
const initialUsersMap = new Map<string, any>();
SEED_USERS.forEach((u) => {
  initialUsersMap.set(u.id, { ...u });
  initialUsersMap.set(u.email, { ...u });
  initialUsersMap.set(u.identifierCode, { ...u });
});

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
  users: initialUsersMap,
  categories: initialCategoriesMap,
  courses: initialCoursesMap,
  attendance: new Map<string, any>(),
  submissions: new Map<string, any>(),
  inquiries: new Map<string, any>(),
  broadcasts: new Map<string, any>(),
  direct_messages: new Map<string, any>(),
};

let lastAttemptTime = 0;
const RETRY_INTERVAL_MS = 3000; // 3 seconds backoff for rapid auto-recovery

/**
 * Seed initial categories, courses and users into MongoDB
 */
export async function seedMongoIfEmpty(db: Db) {
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

    // Upsert all seed & registered users into MongoDB users collection
    const usersCollection = db.collection('users');
    for (const seedUser of SEED_USERS) {
      await usersCollection.updateOne(
        { email: seedUser.email.toLowerCase().trim() },
        { $setOnInsert: seedUser },
        { upsert: true }
      );
    }
    console.log(`[MongoDB] Verified & synchronized default users and seed accounts in database.`);

    // Sync any pending memoryStore users into MongoDB
    await syncMemoryUsersToMongo(db);
  } catch (seedErr) {
    console.warn('[MongoDB] Notice during initial collection seeding:', seedErr);
  }
}

/**
 * Synchronize all in-memory users to MongoDB users collection
 */
export async function syncMemoryUsersToMongo(db: Db): Promise<number> {
  let syncedCount = 0;
  try {
    const usersCollection = db.collection('users');
    const seenEmails = new Set<string>();

    for (const user of memoryStore.users.values()) {
      if (!user || !user.email) continue;
      const cleanEmail = user.email.toLowerCase().trim();
      if (seenEmails.has(cleanEmail)) continue;
      seenEmails.add(cleanEmail);

      const userToSave = {
        ...user,
        email: cleanEmail,
        updatedAt: new Date(),
      };

      await usersCollection.updateOne(
        { email: cleanEmail },
        { $set: userToSave },
        { upsert: true }
      );
      syncedCount++;
    }

    // Also sync enrollments
    const enrollmentsCollection = db.collection('enrollments');
    for (const enr of memoryStore.enrollments.values()) {
      if (!enr || !enr.referenceNumber) continue;
      await enrollmentsCollection.updateOne(
        { referenceNumber: enr.referenceNumber },
        { $set: enr },
        { upsert: true }
      );
    }
  } catch (err) {
    console.warn('[MongoDB] Notice during memory-to-MongoDB sync:', err);
  }
  return syncedCount;
}

/**
 * Format MongoDB error messages to be clean and informative
 */
function formatDbErrorMessage(err: any): string {
  const msg = err?.message || String(err);
  if (msg.includes('SSL routines') || msg.includes('alert number 80') || msg.includes('tlsv1 alert')) {
    return 'MongoDB Atlas TLS handshake rejected. Ensure MongoDB Atlas IP Access List allows 0.0.0.0/0 (Allow Access from Anywhere) and password special characters are URL-encoded.';
  }
  if (msg.includes('bad auth') || msg.includes('Authentication failed')) {
    return 'MongoDB Authentication failed. Verify username and password in MONGODB_URI.';
  }
  if (msg.includes('ETIMEDOUT') || msg.includes('serverSelectionTimeoutMS')) {
    return 'MongoDB connection timed out. Check Atlas cluster state and network whitelist (0.0.0.0/0).';
  }
  return msg;
}

/**
 * Initialize or retrieve the MongoDB database instance.
 * Uses lazy connection, rapid timeouts, and auto-sync.
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
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 8000,
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

    // Ensure initial categories, courses and registered users exist in DB
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
    console.log(`[Database Notice] ${lastError} (Operating in resilient memory mode)`);
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


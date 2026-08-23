import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDatabase, getDatabaseStatus, getMemoryStore } from './server/db.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json({ limit: '10mb' }));

  // ==========================================
  // 1. DATABASE HEALTH & STATUS ENDPOINT
  // ==========================================
  app.get('/api/health', async (_req: Request, res: Response) => {
    const { isConnected, isFallback, error } = await getDatabase();
    const status = getDatabaseStatus();

    res.json({
      status: 'ok',
      service: 'OJIS Media Academy Backend',
      timestamp: new Date().toISOString(),
      database: {
        provider: 'MongoDB',
        connected: isConnected,
        fallbackMode: isFallback,
        configured: status.configured,
        databaseName: status.dbName,
        collections: status.activeCollections,
        message: isConnected
          ? `Connected to MongoDB database: ${status.dbName}`
          : error || 'Operating with high-speed in-memory store (MongoDB URI ready)',
      },
    });
  });

  // ==========================================
  // 2. ENROLLMENT APPLICATIONS APIS
  // ==========================================
  
  // Submit new enrollment application
  app.post('/api/enrollments', async (req: Request, res: Response) => {
    try {
      const enrollmentData = req.body;
      if (!enrollmentData.fullName || !enrollmentData.email) {
        return res.status(400).json({ error: 'Full name and email are required.' });
      }

      const document = {
        ...enrollmentData,
        id: enrollmentData.id || `enr_${Date.now()}`,
        referenceNumber: enrollmentData.referenceNumber || `OJIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        registrationDate: enrollmentData.registrationDate || new Date().toISOString(),
        status: enrollmentData.status || 'Pending Review',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { db, isFallback } = await getDatabase();

      if (db && !isFallback) {
        const collection = db.collection('enrollments');
        await collection.insertOne(document);
      } else {
        getMemoryStore().enrollments.set(document.referenceNumber, document);
      }

      console.log(`[Enrollment] Stored application: ${document.referenceNumber} for ${document.fullName}`);
      return res.status(201).json({ success: true, data: document });
    } catch (err: any) {
      console.error('Error saving enrollment to MongoDB:', err);
      return res.status(500).json({ error: 'Failed to process enrollment.', details: err?.message });
    }
  });

  // Get all enrollments
  app.get('/api/enrollments', async (_req: Request, res: Response) => {
    try {
      const { db, isFallback } = await getDatabase();

      if (db && !isFallback) {
        const collection = db.collection('enrollments');
        const enrollments = await collection.find({}).sort({ createdAt: -1 }).limit(100).toArray();
        return res.json({ success: true, count: enrollments.length, data: enrollments });
      } else {
        const memoryList = Array.from(getMemoryStore().enrollments.values());
        return res.json({ success: true, count: memoryList.length, data: memoryList });
      }
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch enrollments.', details: err?.message });
    }
  });

  // Lookup enrollment by Reference Number or Email
  app.get('/api/enrollments/:reference', async (req: Request, res: Response) => {
    try {
      const ref = req.params.reference.trim();
      const { db, isFallback } = await getDatabase();

      if (db && !isFallback) {
        const collection = db.collection('enrollments');
        const doc = await collection.findOne({
          $or: [
            { referenceNumber: { $regex: new RegExp(`^${ref}$`, 'i') } },
            { email: { $regex: new RegExp(`^${ref}$`, 'i') } },
          ],
        });

        if (!doc) {
          return res.status(404).json({ error: 'Application reference not found.' });
        }
        return res.json({ success: true, data: doc });
      } else {
        const store = getMemoryStore().enrollments;
        let found = store.get(ref);
        if (!found) {
          found = Array.from(store.values()).find(
            (e: any) => e.email?.toLowerCase() === ref.toLowerCase() || e.referenceNumber?.toLowerCase() === ref.toLowerCase()
          );
        }
        if (!found) {
          return res.status(404).json({ error: 'Application reference not found.' });
        }
        return res.json({ success: true, data: found });
      }
    } catch (err: any) {
      return res.status(500).json({ error: 'Error querying reference.', details: err?.message });
    }
  });

  // ==========================================
  // 3. USER AUTHENTICATION & PORTAL APIS
  // ==========================================

  // Register new account (Student / Instructor / Admin)
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, studentDetails, instructorDetails, adminDetails } = req.body;

      if (!name || !email || !role) {
        return res.status(400).json({ error: 'Name, email, and role are required.' });
      }

      const id = `usr_${Date.now()}`;
      const prefix = role === 'student' ? 'STD' : role === 'instructor' ? 'FAC' : 'ADM';
      const identifierCode = `OJIS-${prefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      const userDoc = {
        id,
        name,
        email: email.toLowerCase().trim(),
        role,
        password: password || 'demo1234',
        identifierCode,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        studentDetails: studentDetails || undefined,
        instructorDetails: instructorDetails || undefined,
        adminDetails: adminDetails || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { db, isFallback } = await getDatabase();

      if (db && !isFallback) {
        const collection = db.collection('users');
        const existing = await collection.findOne({ email: userDoc.email });
        if (existing) {
          return res.status(409).json({ error: 'An account with this email address already exists.' });
        }
        await collection.insertOne(userDoc);
      } else {
        const store = getMemoryStore().users;
        if (Array.from(store.values()).some((u: any) => u.email === userDoc.email)) {
          return res.status(409).json({ error: 'An account with this email address already exists.' });
        }
        store.set(userDoc.identifierCode, userDoc);
      }

      // Return sanitized user object
      const { password: _, ...sanitizedUser } = userDoc;
      return res.status(201).json({ success: true, user: sanitizedUser });
    } catch (err: any) {
      console.error('Error during registration:', err);
      return res.status(500).json({ error: 'Failed to create user account.', details: err?.message });
    }
  });

  // Login authentication
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { identifier, password, role } = req.body;
      if (!identifier) {
        return res.status(400).json({ error: 'Identifier (Email or Student ID) is required.' });
      }

      const cleanIdentifier = identifier.trim().toLowerCase();
      const { db, isFallback } = await getDatabase();

      let user: any = null;

      if (db && !isFallback) {
        const collection = db.collection('users');
        user = await collection.findOne({
          $or: [
            { email: cleanIdentifier },
            { identifierCode: { $regex: new RegExp(`^${identifier.trim()}$`, 'i') } },
          ],
        });
      } else {
        const store = getMemoryStore().users;
        user = Array.from(store.values()).find(
          (u: any) =>
            u.email?.toLowerCase() === cleanIdentifier ||
            u.identifierCode?.toLowerCase() === identifier.trim().toLowerCase()
        );
      }

      if (user) {
        const { password: _, ...sanitizedUser } = user;
        return res.json({ success: true, user: sanitizedUser });
      }

      // If user not found in DB, return 401
      return res.status(401).json({
        error: 'Invalid credentials. Please verify your ID/Email or create a new student account.',
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Login verification failed.', details: err?.message });
    }
  });

  // ==========================================
  // 4. STUDIO ATTENDANCE & SUBMISSIONS APIS
  // ==========================================

  // Mark attendance record
  app.post('/api/attendance', async (req: Request, res: Response) => {
    try {
      const { studentId, studentName, date, course, status, markedBy } = req.body;
      const record = {
        id: `att_${Date.now()}`,
        studentId,
        studentName,
        date: date || new Date().toISOString().split('T')[0],
        course,
        status: status || 'Present',
        markedBy: markedBy || 'Lead Instructor',
        timestamp: new Date(),
      };

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('attendance').insertOne(record);
      } else {
        getMemoryStore().attendance.set(record.id, record);
      }

      return res.json({ success: true, record });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to record attendance.', details: err?.message });
    }
  });

  // Admin Broadcast Announcement
  app.post('/api/broadcasts', async (req: Request, res: Response) => {
    try {
      const { title, message, targetAudience, sender } = req.body;
      const broadcastDoc = {
        id: `bc_${Date.now()}`,
        title: title || 'Academy Notice',
        message,
        targetAudience: targetAudience || 'All Academy Students & Faculty',
        sender: sender || 'Academy Admin Operations',
        createdAt: new Date().toISOString(),
      };

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('broadcasts').insertOne(broadcastDoc);
      } else {
        getMemoryStore().broadcasts.set(broadcastDoc.id, broadcastDoc);
      }

      return res.status(201).json({ success: true, broadcast: broadcastDoc });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to send broadcast.', details: err?.message });
    }
  });

  // Contact form submission
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      const inquiryDoc = {
        id: `inq_${Date.now()}`,
        name,
        email,
        phone,
        subject,
        message,
        createdAt: new Date().toISOString(),
      };

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('inquiries').insertOne(inquiryDoc);
      } else {
        getMemoryStore().inquiries.set(inquiryDoc.id, inquiryDoc);
      }

      return res.status(201).json({ success: true, inquiry: inquiryDoc });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to submit contact message.', details: err?.message });
    }
  });

  // ==========================================
  // 5. VITE SPA MIDDLEWARE / STATIC ASSETS
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to 0.0.0.0 and port 3000
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] OJIS Media Academy running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Fatal Error]', err);
});

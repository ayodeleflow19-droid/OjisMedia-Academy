import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDatabase, getDatabaseStatus, getMemoryStore } from './server/db';

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
      const { identifier, password, pin, role } = req.body;
      if (!identifier && !pin) {
        return res.status(400).json({ error: 'Identifier (Email or Student ID) or Authentication PIN is required.' });
      }

      // Check Master Admin authentication PIN
      const MASTER_PIN = '2026';
      const providedPin = pin || password;
      const isMasterRequest = 
        providedPin === MASTER_PIN || 
        providedPin === 'OJIS2026' || 
        identifier?.toLowerCase() === 'ayodeleflow19@gmail.com' ||
        identifier?.toLowerCase() === 'admin';

      if (providedPin === MASTER_PIN || providedPin === 'OJIS2026' || (identifier?.toLowerCase() === 'ayodeleflow19@gmail.com' && (providedPin === '2026' || providedPin === 'OJIS2026' || !providedPin))) {
        const masterAdmin = {
          id: 'usr-master-adm-001',
          role: 'admin',
          name: 'Ayodele (Master Administrator)',
          email: 'ayodeleflow19@gmail.com',
          phone: '+234 800 000 2026',
          identifierCode: 'OJIS-MASTER-ADM-001',
          joinedDate: 'Academy Founding Council 2026',
          status: 'Verified',
          adminDetails: {
            department: 'Academic Board',
            clearanceLevel: 'Master Executive Director & Chancellor',
            authorizedLocations: ['Lagos Ikeja Main Studio', 'Lekki Annex Hub', 'Online Cloud Campus', 'Executive Studio Soundstage'],
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return res.json({ success: true, user: masterAdmin, isMaster: true });
      }

      const cleanIdentifier = identifier ? identifier.trim().toLowerCase() : '';
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
        error: 'Invalid credentials. Please verify your ID/Email or PIN.',
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Login verification failed.', details: err?.message });
    }
  });

  // Dedicated Master Admin PIN Verification Endpoint
  app.post('/api/auth/master-pin', async (req: Request, res: Response) => {
    try {
      const { pin } = req.body;
      const MASTER_PIN = '2026';

      if (pin === MASTER_PIN || pin === 'OJIS2026' || pin === '8826') {
        const masterAdmin = {
          id: 'usr-master-adm-001',
          role: 'admin',
          name: 'Ayodele (Master Administrator)',
          email: 'ayodeleflow19@gmail.com',
          phone: '+234 800 000 2026',
          identifierCode: 'OJIS-MASTER-ADM-001',
          joinedDate: 'Academy Founding Council 2026',
          status: 'Verified',
          adminDetails: {
            department: 'Academic Board',
            clearanceLevel: 'Master Executive Director & Chancellor',
            authorizedLocations: ['Lagos Ikeja Main Studio', 'Lekki Annex Hub', 'Online Cloud Campus', 'Executive Studio Soundstage'],
          },
        };
        return res.json({ success: true, user: masterAdmin, message: 'Master Admin Access Granted' });
      }

      return res.status(401).json({ success: false, error: 'Invalid Master Security PIN. Please try again.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Master PIN verification failed.', details: err?.message });
    }
  });

  // ==========================================
  // 4. MASTER ADMIN USER MANAGEMENT & DIRECTORY APIS
  // ==========================================

  // Get all users (Students, Instructors, Admins)
  app.get('/api/admin/users', async (_req: Request, res: Response) => {
    try {
      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        const users = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();
        const sanitized = users.map((u: any) => {
          const { password, ...rest } = u;
          return rest;
        });
        return res.json({ success: true, count: sanitized.length, users: sanitized });
      } else {
        const memoryUsers = Array.from(getMemoryStore().users.values()).map((u: any) => {
          const { password, ...rest } = u;
          return rest;
        });
        return res.json({ success: true, count: memoryUsers.length, users: memoryUsers });
      }
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch users directory.', details: err?.message });
    }
  });

  // Create new user (Student, Instructor, or Admin)
  app.post('/api/admin/users', async (req: Request, res: Response) => {
    try {
      const userData = req.body;
      if (!userData.name || !userData.email || !userData.role) {
        return res.status(400).json({ error: 'Name, email, and role are required.' });
      }

      const cleanEmail = userData.email.trim().toLowerCase();
      const codePrefix = userData.role === 'student' ? 'OJIS-STD' : (userData.role === 'instructor' ? 'OJIS-FAC' : 'OJIS-ADM');
      const identifierCode = userData.identifierCode || `${codePrefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      const newUser = {
        ...userData,
        id: userData.id || `usr-${Date.now()}`,
        email: cleanEmail,
        identifierCode,
        status: userData.status || 'Active',
        joinedDate: userData.joinedDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        directMessages: userData.directMessages || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('users').insertOne(newUser);
      } else {
        getMemoryStore().users.set(newUser.id, newUser);
      }

      const { password, ...sanitized } = newUser;
      return res.status(201).json({ success: true, user: sanitized });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to create user.', details: err?.message });
    }
  });

  // Update existing user
  app.put('/api/admin/users/:id', async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const updates = req.body;
      delete updates._id; // Ensure MongoDB immutable _id is not updated

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('users').updateOne(
          { $or: [{ id: userId }, { identifierCode: userId }] },
          { $set: { ...updates, updatedAt: new Date() } }
        );
        const updated = await db.collection('users').findOne({
          $or: [{ id: userId }, { identifierCode: userId }],
        });
        if (updated) {
          const { password, ...sanitized } = updated;
          return res.json({ success: true, user: sanitized });
        }
      } else {
        const store = getMemoryStore().users;
        const current = store.get(userId) || Array.from(store.values()).find((u: any) => u.id === userId || u.identifierCode === userId);
        if (current) {
          const updated = { ...current, ...updates, updatedAt: new Date() };
          store.set(current.id, updated);
          const { password, ...sanitized } = updated;
          return res.json({ success: true, user: sanitized });
        }
      }

      return res.status(404).json({ error: 'User not found.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update user.', details: err?.message });
    }
  });

  // Delete user (Master Admin cannot be deleted)
  app.delete('/api/admin/users/:id', async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      if (userId === 'usr-master-adm-001' || userId === 'OJIS-MASTER-ADM-001') {
        return res.status(403).json({ error: 'Master Administrator account cannot be deleted.' });
      }

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('users').deleteOne({
          $or: [{ id: userId }, { identifierCode: userId }],
        });
      } else {
        const store = getMemoryStore().users;
        store.delete(userId);
      }

      return res.json({ success: true, message: 'User deleted successfully.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to delete user.', details: err?.message });
    }
  });

  // Change user status (Suspend, Activate, Verify)
  app.patch('/api/admin/users/:id/status', async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const { status, reason } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required.' });
      }

      if ((userId === 'usr-master-adm-001' || userId === 'OJIS-MASTER-ADM-001') && status === 'Suspended') {
        return res.status(403).json({ error: 'Master Chancellor account cannot be suspended.' });
      }

      const { db, isFallback } = await getDatabase();
      const statusUpdates: any = { status, updatedAt: new Date() };
      if (reason !== undefined) statusUpdates.statusReason = reason;

      if (db && !isFallback) {
        await db.collection('users').updateOne(
          { $or: [{ id: userId }, { identifierCode: userId }] },
          { $set: statusUpdates }
        );
        const updated = await db.collection('users').findOne({
          $or: [{ id: userId }, { identifierCode: userId }],
        });
        if (updated) {
          const { password, ...sanitized } = updated;
          return res.json({ success: true, user: sanitized });
        }
      } else {
        const store = getMemoryStore().users;
        const current = store.get(userId) || Array.from(store.values()).find((u: any) => u.id === userId || u.identifierCode === userId);
        if (current) {
          const updated = { ...current, ...statusUpdates };
          store.set(current.id, updated);
          const { password, ...sanitized } = updated;
          return res.json({ success: true, user: sanitized });
        }
      }

      return res.status(404).json({ error: 'User not found.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update user status.', details: err?.message });
    }
  });

  // Send Direct Message / Alert to a specific user
  app.post('/api/admin/users/:id/message', async (req: Request, res: Response) => {
    try {
      const targetUserId = req.params.id;
      const { subject, message, senderName, senderRole, senderId, priority } = req.body;

      if (!message || !subject) {
        return res.status(400).json({ error: 'Subject and message are required.' });
      }

      const messageDoc = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        targetUserId,
        senderId: senderId || 'usr-master-adm-001',
        senderName: senderName || 'Master Executive Chancellor',
        senderRole: senderRole || 'Academic Board & Chancellor',
        subject,
        message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString(),
        read: false,
        priority: priority || 'normal',
      };

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('direct_messages').insertOne(messageDoc);
        await db.collection('users').updateOne(
          { $or: [{ id: targetUserId }, { identifierCode: targetUserId }] },
          { $push: { directMessages: messageDoc } as any }
        );
      } else {
        getMemoryStore().direct_messages.set(messageDoc.id, messageDoc);
        const store = getMemoryStore().users;
        const current = store.get(targetUserId) || Array.from(store.values()).find((u: any) => u.id === targetUserId || u.identifierCode === targetUserId);
        if (current) {
          const msgs = current.directMessages || [];
          msgs.unshift(messageDoc);
          current.directMessages = msgs;
          store.set(current.id, current);
        }
      }

      return res.status(201).json({ success: true, message: messageDoc });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to send message.', details: err?.message });
    }
  });

  // ==========================================
  // 5. STUDIO ATTENDANCE & SUBMISSIONS APIS
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

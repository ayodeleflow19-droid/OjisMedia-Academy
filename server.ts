import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDatabase, getDatabaseStatus, getMemoryStore, syncMemoryUsersToMongo } from './server/db';
import { SEED_CATEGORIES, SEED_COURSES } from './server/seedData';
import { sendActivationEmail, getEmailProviderStatus, sendTestEmail, getSentEmails, getLatestSentEmail } from './server/email';

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

        // Also ensure a corresponding user account exists in users collection
        const usersCollection = db.collection('users');
        const existingUser = await usersCollection.findOne({ email: document.email.toLowerCase().trim() });
        if (!existingUser) {
          const autoUser = {
            id: `usr_${Date.now()}`,
            name: document.fullName,
            email: document.email.toLowerCase().trim(),
            phone: document.phone || '+234 812 000 0000',
            role: 'student',
            password: 'studentpassword2026',
            identifierCode: `OJIS-STD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
            status: 'Active',
            joinedDate: new Date().toISOString().split('T')[0],
            studentDetails: {
              enrolledCourseId: document.selectedCourseId,
              enrolledCourseTitle: document.selectedCourseTitle,
              cohort: document.preferredCohort || 'April 2026 Cohort',
              learningMode: document.learningMode || 'Physical',
              attendancePercentage: 100,
              completedModules: 0,
              totalModules: 10,
              tuitionStatus: 'Pending Review',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await usersCollection.insertOne(autoUser);
          console.log(`[Enrollment] Auto-created student user in MongoDB: ${autoUser.email}`);
        }
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

  // Check Email Service configuration status
  app.get('/api/email/status', (_req: Request, res: Response) => {
    const status = getEmailProviderStatus();
    return res.json({ success: true, emailService: status });
  });

  // Get delivered emails inbox (filtered by recipient or all)
  app.get('/api/emails', (req: Request, res: Response) => {
    const email = req.query.email as string;
    const emails = getSentEmails(email);
    return res.json({ success: true, count: emails.length, emails });
  });

  // Get latest email for a specific recipient
  app.get('/api/emails/latest', (req: Request, res: Response) => {
    const email = req.query.email as string;
    const latest = getLatestSentEmail(email);
    return res.json({ success: true, email: latest });
  });

  // Send diagnostic test email
  app.post('/api/email/test-send', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const targetEmail = (email || 'ayodeleflow19@gmail.com').trim().toLowerCase();
      const result = await sendTestEmail(targetEmail);
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e?.message || 'Error sending test email' });
    }
  });

  // Register new account (Student / Instructor / Admin) with email activation
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, studentDetails, instructorDetails, adminDetails } = req.body;

      if (!name || !email || !role) {
        return res.status(400).json({ error: 'Name, email, and role are required.' });
      }

      const id = `usr_${Date.now()}`;
      const prefix = role === 'student' ? 'STD' : role === 'instructor' ? 'FAC' : 'ADM';
      const identifierCode = `OJIS-${prefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const activationToken = `act_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
      const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

      const userDoc = {
        id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role,
        password: password || 'demo1234',
        identifierCode,
        status: 'Pending Activation', // Account is pending until activated
        isVerified: false,
        activationCode,
        verificationToken: activationToken,
        tokenCreatedAt: new Date(),
        joinedDate: new Date().toISOString().split('T')[0],
        studentDetails: studentDetails || undefined,
        instructorDetails: instructorDetails || undefined,
        adminDetails: adminDetails || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Always store in memory store first for immediate local availability
      const store = getMemoryStore().users;
      store.set(userDoc.id, userDoc);
      store.set(userDoc.email, userDoc);
      store.set(userDoc.identifierCode, userDoc);

      const { db, isFallback } = await getDatabase();

      if (db && !isFallback) {
        try {
          const collection = db.collection('users');
          // Upsert or insert into MongoDB
          await collection.updateOne(
            { email: userDoc.email },
            { $set: userDoc },
            { upsert: true }
          );
          console.log(`[MongoDB] Successfully recorded registered user: ${userDoc.email} (${userDoc.role})`);
        } catch (dbErr) {
          console.warn('[MongoDB] Warning during user insert:', dbErr);
        }
      }

      // Determine App Base URL for the activation link
      const host = req.headers.host || 'localhost:3000';
      const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
      const appUrl = process.env.APP_URL || `${proto}://${host}`;

      // Dispatch activation email with 6-digit code asynchronously
      const emailResult = await sendActivationEmail({
        to: userDoc.email,
        name: userDoc.name,
        role: userDoc.role as any,
        identifierCode: userDoc.identifierCode,
        courseTitle: userDoc.studentDetails?.enrolledCourseTitle || userDoc.instructorDetails?.department,
        cohort: userDoc.studentDetails?.cohort,
        activationCode,
        activationToken,
        appUrl,
      });

      // Return sanitized user object & activation meta
      const { password: _, verificationToken: __, ...sanitizedUser } = userDoc;
      return res.status(201).json({
        success: true,
        user: sanitizedUser,
        activationCode,
        emailStatus: {
          sent: emailResult.success,
          provider: emailResult.provider,
          activationUrl: emailResult.activationUrl,
          activationCode,
          message: emailResult.success 
            ? `Activation code [${activationCode}] sent to ${userDoc.email} via ${emailResult.provider}`
            : emailResult.error || 'Activation email pending delivery',
          error: emailResult.error,
        },
      });
    } catch (err: any) {
      console.error('Error during registration:', err);
      return res.status(500).json({ error: 'Failed to create user account.', details: err?.message });
    }
  });

  // Activate Account with token or 6-digit code
  app.all(['/api/auth/activate', '/api/auth/verify-email'], async (req: Request, res: Response) => {
    try {
      const token = (req.query.token as string) || req.body?.token;
      const code = (req.query.code as string) || req.body?.code;
      const email = (req.query.email as string) || req.body?.email;

      if (!token && !code && !email) {
        return res.status(400).json({ error: 'Activation code, token, or email is required.' });
      }

      const cleanEmail = email ? email.toLowerCase().trim() : '';
      const cleanCode = code ? code.toString().trim() : '';
      const { db, isFallback } = await getDatabase();
      let updatedUser: any = null;

      if (db && !isFallback) {
        const collection = db.collection('users');
        
        let query: any = {};
        if (token) {
          query = { verificationToken: token };
        } else if (cleanEmail && cleanCode) {
          query = { email: cleanEmail, activationCode: cleanCode };
        } else if (cleanCode) {
          query = { activationCode: cleanCode };
        } else if (cleanEmail) {
          query = { email: cleanEmail };
        }

        const user = await collection.findOne(query);

        if (!user) {
          return res.status(404).json({ error: 'Invalid activation code or link. Please verify and try again.' });
        }

        await collection.updateOne(
          { _id: user._id },
          {
            $set: {
              isVerified: true,
              status: 'Active',
              verifiedAt: new Date(),
              updatedAt: new Date(),
            },
            $unset: { verificationToken: '', activationCode: '' },
          }
        );

        updatedUser = await collection.findOne({ _id: user._id });
      } else {
        const store = getMemoryStore().users;
        const user = Array.from(store.values()).find((u: any) => {
          if (token && u.verificationToken === token) return true;
          if (cleanEmail && cleanCode && u.email?.toLowerCase() === cleanEmail && u.activationCode === cleanCode) return true;
          if (cleanCode && u.activationCode === cleanCode) return true;
          if (cleanEmail && u.email?.toLowerCase() === cleanEmail) return true;
          return false;
        });

        if (!user) {
          return res.status(404).json({ error: 'Invalid activation code or link. Please verify and try again.' });
        }

        user.isVerified = true;
        user.status = 'Active';
        user.verifiedAt = new Date();
        delete user.verificationToken;
        delete user.activationCode;
        store.set(user.identifierCode, user);
        updatedUser = user;
      }

      const { password: _, verificationToken: __, activationCode: ___, ...sanitized } = updatedUser;
      return res.json({
        success: true,
        message: 'Your OJIS Media Academy account has been successfully verified & activated!',
        user: sanitized,
      });
    } catch (err: any) {
      console.error('Error activating account:', err);
      return res.status(500).json({ error: 'Failed to activate account.', details: err?.message });
    }
  });

  // Resend Activation Email
  app.post('/api/auth/resend-activation', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email address is required.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const { db, isFallback } = await getDatabase();
      let targetUser: any = null;

      const newActivationToken = `act_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
      const newActivationCode = Math.floor(100000 + Math.random() * 900000).toString();

      if (db && !isFallback) {
        const collection = db.collection('users');
        targetUser = await collection.findOne({ email: cleanEmail });
        if (!targetUser) {
          return res.status(404).json({ error: 'No account found with this email address.' });
        }

        await collection.updateOne(
          { _id: targetUser._id },
          {
            $set: {
              verificationToken: newActivationToken,
              activationCode: newActivationCode,
              tokenCreatedAt: new Date(),
              updatedAt: new Date(),
            },
          }
        );
      } else {
        const store = getMemoryStore().users;
        targetUser = Array.from(store.values()).find((u: any) => u.email === cleanEmail);
        if (!targetUser) {
          return res.status(404).json({ error: 'No account found with this email address.' });
        }
        targetUser.verificationToken = newActivationToken;
        targetUser.activationCode = newActivationCode;
        store.set(targetUser.identifierCode, targetUser);
      }

      const host = req.headers.host || 'localhost:3000';
      const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
      const appUrl = process.env.APP_URL || `${proto}://${host}`;

      const emailResult = await sendActivationEmail({
        to: targetUser.email,
        name: targetUser.name,
        role: targetUser.role,
        identifierCode: targetUser.identifierCode,
        courseTitle: targetUser.studentDetails?.enrolledCourseTitle || targetUser.instructorDetails?.department,
        cohort: targetUser.studentDetails?.cohort,
        activationCode: newActivationCode,
        activationToken: newActivationToken,
        appUrl,
      });

      return res.json({
        success: true,
        message: `Activation code [${newActivationCode}] re-sent to ${targetUser.email}`,
        activationCode: newActivationCode,
        emailStatus: {
          sent: emailResult.success,
          provider: emailResult.provider,
          activationUrl: emailResult.activationUrl,
          activationCode: newActivationCode,
        },
      });
    } catch (err: any) {
      console.error('Error re-sending activation email:', err);
      return res.status(500).json({ error: 'Failed to re-send activation email.', details: err?.message });
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
          isVerified: true,
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
        // Enforce Activation: Check if account is verified
        const isUserVerified = user.isVerified === true || user.status === 'Verified' || user.role === 'admin';
        if (!isUserVerified) {
          return res.status(403).json({
            success: false,
            error: 'Your account is pending activation. Please enter the 6-digit activation code sent to your email to activate your account.',
            isUnverified: true,
            email: user.email,
            identifierCode: user.identifierCode,
            activationCode: user.activationCode,
            role: user.role,
          });
        }

        // Verify password if set
        if (user.password && password && user.password !== password) {
          return res.status(401).json({
            error: 'Invalid password. Please check your credentials.',
          });
        }

        const { password: _, verificationToken: __, activationCode: ___, ...sanitizedUser } = user;
        return res.json({ success: true, user: sanitizedUser });
      }

      // If user not found in DB, return 401
      return res.status(401).json({
        error: 'Invalid credentials. Please verify your ID/Email and password.',
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
        // Auto-sync any memory store users into MongoDB first
        await syncMemoryUsersToMongo(db);

        const users = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();
        const sanitized = users.map((u: any) => {
          const { password, ...rest } = u;
          return rest;
        });
        return res.json({ success: true, count: sanitized.length, users: sanitized, databaseProvider: 'MongoDB' });
      } else {
        const memoryUsers = Array.from(getMemoryStore().users.values()).map((u: any) => {
          const { password, ...rest } = u;
          return rest;
        });
        // Deduplicate by email
        const uniqueMap = new Map<string, any>();
        memoryUsers.forEach((u: any) => {
          if (u.email) uniqueMap.set(u.email.toLowerCase(), u);
        });
        const uniqueUsers = Array.from(uniqueMap.values());
        return res.json({ success: true, count: uniqueUsers.length, users: uniqueUsers, databaseProvider: 'MemoryFallback' });
      }
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch users directory.', details: err?.message });
    }
  });

  // Explicit Sync Users to MongoDB
  app.post('/api/admin/sync-users', async (_req: Request, res: Response) => {
    try {
      const { db, isConnected, isFallback, error } = await getDatabase();
      if (db && !isFallback) {
        const syncedCount = await syncMemoryUsersToMongo(db);
        const mongoCount = await db.collection('users').countDocuments({});
        return res.json({
          success: true,
          message: `Successfully synchronized ${syncedCount} users into MongoDB. Total registered users in database: ${mongoCount}.`,
          syncedCount,
          mongoCount,
          databaseStatus: 'Connected',
        });
      } else {
        return res.json({
          success: false,
          error: error || 'MongoDB is not currently connected. Operating in resilient in-memory mode.',
          databaseStatus: isConnected ? 'Connected' : 'Fallback Mode',
        });
      }
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || 'Error executing sync.' });
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

  // Assign or toggle Instructor Course Creation Privilege (Admin & Master Admin power)
  app.patch('/api/admin/instructors/:id/permission', async (req: Request, res: Response) => {
    try {
      const instructorId = req.params.id;
      const { canCreateCourses } = req.body;

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('users').updateOne(
          { $or: [{ id: instructorId }, { identifierCode: instructorId }] },
          { $set: { 'instructorDetails.canCreateCourses': Boolean(canCreateCourses), updatedAt: new Date() } }
        );
        const updated = await db.collection('users').findOne({
          $or: [{ id: instructorId }, { identifierCode: instructorId }],
        });
        if (updated) {
          const { password, ...sanitized } = updated;
          return res.json({ success: true, user: sanitized });
        }
      } else {
        const store = getMemoryStore().users;
        const current = store.get(instructorId) || Array.from(store.values()).find((u: any) => u.id === instructorId || u.identifierCode === instructorId);
        if (current) {
          const updated = {
            ...current,
            instructorDetails: {
              ...(current.instructorDetails || {}),
              canCreateCourses: Boolean(canCreateCourses),
            },
            updatedAt: new Date(),
          };
          store.set(current.id, updated);
          const { password, ...sanitized } = updated;
          return res.json({ success: true, user: sanitized });
        }
      }

      return res.status(404).json({ error: 'Instructor not found.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update instructor course creation privilege.', details: err?.message });
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
  // 5. MASTER ADMIN CATEGORIES GOVERNANCE APIS
  // ==========================================

  // Get all categories
  app.get('/api/categories', async (_req: Request, res: Response) => {
    try {
      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        // Also remove design if lingering
        await db.collection('categories').deleteOne({ $or: [{ id: 'design' }, { shortLabel: 'Design & UI' }] });
        let categories = await db.collection('categories').find({ id: { $ne: 'design' } }).toArray();
        if (!categories || categories.length === 0) {
          await db.collection('categories').insertMany(SEED_CATEGORIES.map(c => ({ ...c })));
          categories = await db.collection('categories').find({ id: { $ne: 'design' } }).toArray();
        }
        return res.json({ success: true, count: categories.length, categories });
      } else {
        const store = getMemoryStore().categories;
        store.delete('design');
        let memoryCategories = Array.from(store.values()).filter((c: any) => c.id !== 'design');
        if (memoryCategories.length === 0) {
          SEED_CATEGORIES.forEach(c => store.set(c.id, { ...c }));
          memoryCategories = Array.from(store.values()).filter((c: any) => c.id !== 'design');
        }
        return res.json({ success: true, count: memoryCategories.length, categories: memoryCategories });
      }
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch categories.', details: err?.message });
    }
  });

  // Create Category (Master Admin power)
  app.post('/api/admin/categories', async (req: Request, res: Response) => {
    try {
      const categoryData = req.body;
      if (!categoryData.name) {
        return res.status(400).json({ error: 'Category name is required.' });
      }

      const cleanId = (categoryData.id || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).toLowerCase();
      const newCategory = {
        ...categoryData,
        id: cleanId,
        shortLabel: categoryData.shortLabel || categoryData.name,
        description: categoryData.description || '',
        icon: categoryData.icon || 'Layers',
        status: categoryData.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('categories').updateOne(
          { id: cleanId },
          { $set: newCategory },
          { upsert: true }
        );
      } else {
        getMemoryStore().categories.set(cleanId, newCategory);
      }

      return res.status(201).json({ success: true, category: newCategory });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to create category.', details: err?.message });
    }
  });

  // Modify Category (Master Admin power)
  app.put('/api/admin/categories/:id', async (req: Request, res: Response) => {
    try {
      const categoryId = req.params.id.toLowerCase();
      const updates = req.body;
      delete updates._id;

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('categories').updateOne(
          { id: categoryId },
          { $set: { ...updates, updatedAt: new Date().toISOString() } }
        );
        const updated = await db.collection('categories').findOne({ id: categoryId });
        if (updated) return res.json({ success: true, category: updated });
      } else {
        const store = getMemoryStore().categories;
        const current = store.get(categoryId);
        if (current) {
          const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
          store.set(categoryId, updated);
          return res.json({ success: true, category: updated });
        }
      }

      return res.status(404).json({ error: 'Category not found.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to modify category.', details: err?.message });
    }
  });

  // Suspend or Activate Category (Master Admin power)
  app.patch('/api/admin/categories/:id/status', async (req: Request, res: Response) => {
    try {
      const categoryId = req.params.id.toLowerCase();
      const { status } = req.body;

      if (!status || (status !== 'active' && status !== 'suspended')) {
        return res.status(400).json({ error: 'Valid status ("active" or "suspended") is required.' });
      }

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('categories').updateOne(
          { id: categoryId },
          { $set: { status, updatedAt: new Date().toISOString() } }
        );
        const updated = await db.collection('categories').findOne({ id: categoryId });
        if (updated) return res.json({ success: true, category: updated });
      } else {
        const store = getMemoryStore().categories;
        const current = store.get(categoryId);
        if (current) {
          const updated = { ...current, status, updatedAt: new Date().toISOString() };
          store.set(categoryId, updated);
          return res.json({ success: true, category: updated });
        }
      }

      return res.status(404).json({ error: 'Category not found.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update category status.', details: err?.message });
    }
  });

  // Delete Category (Master Admin power)
  app.delete('/api/admin/categories/:id', async (req: Request, res: Response) => {
    try {
      const categoryId = req.params.id.toLowerCase();
      const { db, isFallback } = await getDatabase();

      if (db && !isFallback) {
        await db.collection('categories').deleteOne({ id: categoryId });
        // Cascade delete courses under this category
        await db.collection('courses').deleteMany({ category: categoryId });
      } else {
        getMemoryStore().categories.delete(categoryId);
        const courseStore = getMemoryStore().courses;
        for (const [key, val] of courseStore.entries()) {
          if (val.category?.toLowerCase() === categoryId) {
            courseStore.delete(key);
          }
        }
      }

      return res.json({ success: true, message: `Category ${categoryId} and its associated courses deleted successfully.` });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to delete category.', details: err?.message });
    }
  });

  // ==========================================
  // 6. ADMIN & MASTER COURSES CURRICULUM APIS
  // ==========================================

  // Get all courses
  app.get('/api/courses', async (_req: Request, res: Response) => {
    try {
      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        // Also remove design courses if lingering
        await db.collection('courses').deleteMany({ $or: [{ category: 'design' }, { id: 'graphic-design' }, { id: 'ui-design' }] });
        let courses = await db.collection('courses').find({ category: { $ne: 'design' } }).toArray();
        if (!courses || courses.length === 0) {
          await db.collection('courses').insertMany(SEED_COURSES.map(c => ({ ...c })));
          courses = await db.collection('courses').find({ category: { $ne: 'design' } }).toArray();
        }
        return res.json({ success: true, count: courses.length, courses });
      } else {
        const store = getMemoryStore().courses;
        store.delete('graphic-design');
        store.delete('ui-design');
        for (const [key, val] of store.entries()) {
          if (val.category === 'design' || val.id === 'graphic-design' || val.id === 'ui-design') {
            store.delete(key);
          }
        }
        let memoryCourses = Array.from(store.values()).filter((c: any) => c.category !== 'design');
        if (memoryCourses.length === 0) {
          SEED_COURSES.forEach(c => store.set(c.id, { ...c }));
          memoryCourses = Array.from(store.values()).filter((c: any) => c.category !== 'design');
        }
        return res.json({ success: true, count: memoryCourses.length, courses: memoryCourses });
      }
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch courses.', details: err?.message });
    }
  });

  // Create Course (Admin, Master Admin, or Authorized Instructor)
  app.post('/api/courses', async (req: Request, res: Response) => {
    try {
      const courseData = req.body;
      if (!courseData.title || !courseData.category) {
        return res.status(400).json({ error: 'Course title and category are required.' });
      }

      const cleanId = (courseData.id || courseData.slug || courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).toLowerCase();
      const newCourse = {
        ...courseData,
        id: cleanId,
        slug: courseData.slug || cleanId,
        status: courseData.status || 'active',
        formattedPrice: courseData.formattedPrice || (courseData.price ? `₦${Number(courseData.price).toLocaleString()}` : '₦0'),
        tools: Array.isArray(courseData.tools) ? courseData.tools : [],
        outcomes: Array.isArray(courseData.outcomes) ? courseData.outcomes : [],
        curriculum: Array.isArray(courseData.curriculum) ? courseData.curriculum : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('courses').updateOne(
          { id: cleanId },
          { $set: newCourse },
          { upsert: true }
        );
      } else {
        getMemoryStore().courses.set(cleanId, newCourse);
      }

      return res.status(201).json({ success: true, course: newCourse });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to create course.', details: err?.message });
    }
  });

  // Modify Course (Admin & Master Admin power)
  app.put('/api/admin/courses/:id', async (req: Request, res: Response) => {
    try {
      const courseId = req.params.id;
      const updates = req.body;
      delete updates._id;

      if (updates.price !== undefined && !updates.formattedPrice) {
        updates.formattedPrice = `₦${Number(updates.price).toLocaleString()}`;
      }

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('courses').updateOne(
          { $or: [{ id: courseId }, { slug: courseId }] },
          { $set: { ...updates, updatedAt: new Date().toISOString() } }
        );
        const updated = await db.collection('courses').findOne({
          $or: [{ id: courseId }, { slug: courseId }],
        });
        if (updated) return res.json({ success: true, course: updated });
      } else {
        const store = getMemoryStore().courses;
        const current = store.get(courseId) || Array.from(store.values()).find((c: any) => c.id === courseId || c.slug === courseId);
        if (current) {
          const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
          store.set(current.id, updated);
          return res.json({ success: true, course: updated });
        }
      }

      return res.status(404).json({ error: 'Course not found.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update course.', details: err?.message });
    }
  });

  // Suspend or Activate Course (Admin & Master Admin power)
  app.patch('/api/admin/courses/:id/status', async (req: Request, res: Response) => {
    try {
      const courseId = req.params.id;
      const { status } = req.body;

      if (!status || (status !== 'active' && status !== 'suspended' && status !== 'draft')) {
        return res.status(400).json({ error: 'Valid status ("active", "suspended", or "draft") is required.' });
      }

      const { db, isFallback } = await getDatabase();
      if (db && !isFallback) {
        await db.collection('courses').updateOne(
          { $or: [{ id: courseId }, { slug: courseId }] },
          { $set: { status, updatedAt: new Date().toISOString() } }
        );
        const updated = await db.collection('courses').findOne({
          $or: [{ id: courseId }, { slug: courseId }],
        });
        if (updated) return res.json({ success: true, course: updated });
      } else {
        const store = getMemoryStore().courses;
        const current = store.get(courseId) || Array.from(store.values()).find((c: any) => c.id === courseId || c.slug === courseId);
        if (current) {
          const updated = { ...current, status, updatedAt: new Date().toISOString() };
          store.set(current.id, updated);
          return res.json({ success: true, course: updated });
        }
      }

      return res.status(404).json({ error: 'Course not found.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update course status.', details: err?.message });
    }
  });

  // Delete Course (Admin & Master Admin power)
  app.delete('/api/admin/courses/:id', async (req: Request, res: Response) => {
    try {
      const courseId = req.params.id;
      const { db, isFallback } = await getDatabase();

      if (db && !isFallback) {
        await db.collection('courses').deleteOne({
          $or: [{ id: courseId }, { slug: courseId }],
        });
      } else {
        const store = getMemoryStore().courses;
        store.delete(courseId);
        // Also check by slug
        for (const [key, val] of store.entries()) {
          if (val.slug === courseId || val.id === courseId) {
            store.delete(key);
          }
        }
      }

      return res.json({ success: true, message: `Course ${courseId} deleted successfully.` });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to delete course.', details: err?.message });
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

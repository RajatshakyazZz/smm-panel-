import { initializeApp as initClientApp, getApps as getClientApps, getApp as getClientApp, FirebaseApp } from 'firebase/app';
import { getFirestore as getClientFirestore, Firestore } from 'firebase/firestore';
import { getAuth as getClientAuth, Auth } from 'firebase/auth';
import { initializeApp as initAdminApp, getApps as getAdminApps, cert } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore, Firestore as AdminFirestore } from 'firebase-admin/firestore';

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export function getFirebaseConfig(): FirebaseConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  };
}

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return Boolean(config.apiKey && config.projectId);
}

let clientApp: FirebaseApp | null = null;
let clientDb: Firestore | null = null;
let clientAuth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  const config = getFirebaseConfig();
  if (!config.apiKey || !config.projectId) {
    throw new Error('Firebase configuration is missing. Set NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID.');
  }

  if (!getClientApps().length) {
    clientApp = initClientApp(config);
  } else {
    clientApp = getClientApp();
  }
  return clientApp;
}

export function getFirebaseDb(): Firestore {
  if (!clientDb) {
    clientDb = getClientFirestore(getFirebaseApp());
  }
  return clientDb;
}

export function getFirebaseAuth(): Auth {
  if (!clientAuth) {
    clientAuth = getClientAuth(getFirebaseApp());
  }
  return clientAuth;
}

// Server-side Firebase Admin Initialization
let adminDbInstance: AdminFirestore | null = null;

export function isFirebaseAdminConfigured(): boolean {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  return Boolean(projectId && (clientEmail || process.env.FIREBASE_CONFIG));
}

export function getFirebaseAdminDb(): AdminFirestore {
  if (adminDbInstance) return adminDbInstance;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (!getAdminApps().length) {
    if (clientEmail && privateKey && projectId) {
      initAdminApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else if (projectId) {
      initAdminApp({ projectId });
    } else {
      initAdminApp();
    }
  }

  adminDbInstance = getAdminFirestore();
  return adminDbInstance;
}

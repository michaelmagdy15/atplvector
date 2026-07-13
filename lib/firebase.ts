import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  collection as firestoreCollection,
  doc as firestoreDoc,
  CollectionReference,
  DocumentReference,
  DocumentData,
  Firestore
} from 'firebase/firestore';

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

// Validate all required env vars are present at startup
for (const key of requiredEnvVars) {
  if (!import.meta.env[key]) {
    console.error(`Missing required environment variable: ${key}. Check your .env file.`);
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
});

// Custom collection wrapper that prefixes "atpl_" to root collections
export function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData> {
  const prefixedPath = path.startsWith('atpl_') ? path : `atpl_${path}`;
  return firestoreCollection(firestore, prefixedPath, ...pathSegments);
}

// Custom doc wrapper that prefixes "atpl_" to root collections
export function doc(
  firestoreOrRef: any,
  path?: string,
  ...pathSegments: string[]
): any {
  if (typeof firestoreOrRef?.type === 'string' && (firestoreOrRef.type === 'collection' || firestoreOrRef.type === 'document')) {
    return firestoreDoc(firestoreOrRef, path!, ...pathSegments);
  }
  if (path) {
    const prefixedPath = path.startsWith('atpl_') ? path : `atpl_${path}`;
    return firestoreDoc(firestoreOrRef, prefixedPath, ...pathSegments);
  }
  return firestoreDoc(firestoreOrRef);
}

export const getSiteUrl = () => {
  let url =
    // @ts-ignore
    import.meta.env?.VITE_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }

  url = url.replace(/\/$/, '');
  return url;
};

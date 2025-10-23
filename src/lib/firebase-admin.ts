import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

if (!admin.apps.length) {
  const serviceAccountPath = path.resolve('./firebase-service-account.json');

  if (fs.existsSync(serviceAccountPath)) {
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch (error: any) {
      console.warn('Failed to parse `firebase-service-account.json`:', error.message);
    }
  } else {
    const serviceAccountJson = process.env.FIREBASE_CREDENTIALS_JSON;

    if (!serviceAccountJson) {
      console.warn(
        'Firebase Admin credentials are not configured. Recommended: create a `firebase-service-account.json` file. Fallback: set the `FIREBASE_CREDENTIALS_JSON` environment variable.'
      );
    } else {
      try {
        const serviceAccount = JSON.parse(serviceAccountJson);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
      } catch (error: any) {
        console.warn('Failed to parse `FIREBASE_CREDENTIALS_JSON`:', error.message);
      }
    }
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminStorage = admin.apps.length ? admin.storage() : null;

// Helper function to verify session cookie
export async function verifySessionCookie(sessionCookie: string) {
  if (!adminAuth) {
    throw new Error('Firebase Admin not initialized');
  }
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    throw new Error('Invalid session cookie');
  }
}

export default admin;

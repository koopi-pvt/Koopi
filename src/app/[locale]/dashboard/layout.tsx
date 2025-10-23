import React, { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { SerializableStore } from '@/types/user';

async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!session || !adminAuth) {
    return null;
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
    return decodedClaims;
  } catch {
    return null;
  }
}

async function getUserStore(userId: string): Promise<SerializableStore | null> {
  if (!adminDb) {
    return null;
  }
  
  try {
    const storesSnapshot = await adminDb
      .collection('stores')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (storesSnapshot.empty) {
      return null;
    }

    const storeDoc = storesSnapshot.docs[0];
    const firestoreData = storeDoc.data();

    if (!firestoreData) {
      return null;
    }

    const { trialEndsAt, createdAt, updatedAt, ...rest } = firestoreData;

    // Helper function to safely convert Firestore timestamps to ISO strings
    const toISOString = (value: any): string => {
      if (!value) return new Date().toISOString();
      if (typeof value === 'string') return value;
      if (value instanceof Date) return value.toISOString();
      if (typeof value.toDate === 'function') return value.toDate().toISOString();
      return new Date().toISOString();
    };

    // The cast is now much safer as we are explicitly handling the mismatched property.
    return {
      ...rest,
      storeId: storeDoc.id,
      trialEndsAt: trialEndsAt ? toISOString(trialEndsAt) : null,
      createdAt: toISOString(createdAt),
      updatedAt: toISOString(updatedAt),
    } as SerializableStore;
  } catch (error) {
    console.error('Error fetching store:', error);
    return null;
  }
}

async function getUserData(userId: string) {
  if (!adminDb) {
    return null;
  }
  
  try {
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return null;
    }
    return userDoc.data();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export default async function Layout({ 
  children,
  params 
}: { 
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getSessionUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Fetch user and store data
  const [userData, storeData] = await Promise.all([
    getUserData(user.uid),
    getUserStore(user.uid)
  ]);

  // Calculate trial days remaining
  let trialDaysRemaining = 0;
  if (storeData?.trialEndsAt) {
    const now = new Date();
    const trialEnd = new Date(storeData.trialEndsAt);
    const diffTime = trialEnd.getTime() - now.getTime();
    trialDaysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const initialData = {
    user: {
      uid: user.uid,
      email: user.email || '',
      displayName: userData?.displayName || user.name || '',
      photoURL: userData?.photoURL || user.picture || '',
      phoneNumber: userData?.phoneNumber || '',
      emailVerified: user.email_verified || false,
      onboardingCompleted: userData?.onboardingCompleted || false,
    },
    store: storeData ? {
      ...storeData,
      trialDaysRemaining,
    } : null,
  };

  return (
    <DashboardLayout initialData={initialData}>
      {children}
    </DashboardLayout>
  );
}
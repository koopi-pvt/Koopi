import { NextRequest, NextResponse } from 'next/server';
import { adminDb, verifySessionCookie } from '@/lib/firebase-admin';

// GET /api/store - Get user's store
export async function GET(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 });
    }

    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await verifySessionCookie(sessionCookie);
    const userId = decodedClaims.uid;

    const storesSnapshot = await adminDb
      .collection('stores')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (storesSnapshot.empty) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const storeDoc = storesSnapshot.docs[0];
    const store = { id: storeDoc.id, ...storeDoc.data() };

    return NextResponse.json({ store });
  } catch (error: any) {
    console.error('Error fetching store:', error);
    return NextResponse.json({ error: 'Failed to fetch store', details: error.message }, { status: 500 });
  }
}

// PUT /api/store - Update user's store
export async function PUT(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 });
    }

    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await verifySessionCookie(sessionCookie);
    const userId = decodedClaims.uid;

    const storesSnapshot = await adminDb
      .collection('stores')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (storesSnapshot.empty) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const storeDoc = storesSnapshot.docs[0];
    const updates = await request.json();

    // Don't allow changing slug, userId, etc.
    delete updates.storeSlug;
    delete updates.userId;
    delete updates.createdAt;
    delete updates.plan;
    delete updates.trialEndsAt;
    delete updates.status;

    const updatedStore = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection('stores').doc(storeDoc.id).update(updatedStore);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating store:', error);
    return NextResponse.json({ error: 'Failed to update store', details: error.message }, { status: 500 });
  }
}
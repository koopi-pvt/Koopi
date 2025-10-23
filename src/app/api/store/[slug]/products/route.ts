import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// GET /api/store/[slug]/products - Get all active products for a store (public)
export async function GET(
  request: NextRequest
) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      );
    }

    // Expected URL: /api/store/[slug]/products
    const pathParts = request.nextUrl.pathname.split('/');
    const slug = pathParts[3];

    if (!slug) {
      return NextResponse.json({ error: 'Slug not found in URL' }, { status: 400 });
    }

    // Find store by slug
    const storeSnapshot = await adminDb
      .collection('slugs')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (storeSnapshot.empty) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    const storeSlugData = storeSnapshot.docs[0].data();
    const storeId = storeSlugData.storeId;

    // Get store details
    const storeDoc = await adminDb.collection('stores').doc(storeId).get();
    
    if (!storeDoc.exists) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    const store = { id: storeDoc.id, ...storeDoc.data() };

    // Get all active products for this store
    const productsSnapshot = await adminDb
      .collection('products')
      .where('storeId', '==', storeId)
      .where('status', '==', 'Active')
      .orderBy('createdAt', 'desc')
      .get();

    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ 
      store,
      products 
    });
  } catch (error) {
    console.error('Error fetching store products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

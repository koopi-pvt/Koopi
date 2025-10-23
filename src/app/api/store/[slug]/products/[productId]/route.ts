import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// GET /api/store/[slug]/products/[productId] - Get specific product details (public)
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

    // Expected URL: /api/store/[slug]/products/[productId]
    const pathParts = request.nextUrl.pathname.split('/');
    const slug = pathParts[3];
    const productId = pathParts[5];

    if (!slug || !productId) {
      return NextResponse.json({ error: 'Slug or Product ID not found in URL' }, { status: 400 });
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

    // Get product
    const productDoc = await adminDb.collection('products').doc(productId).get();

    if (!productDoc.exists) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const productData = productDoc.data();

    // Verify product belongs to this store and is active
    if (!productData || productData.storeId !== storeId || productData.status !== 'Active') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get store details
    const storeDoc = await adminDb.collection('stores').doc(storeId).get();
    const store = storeDoc.exists ? { id: storeDoc.id, ...storeDoc.data() } : null;

    const product = { id: productDoc.id, ...productData };

    return NextResponse.json({
      product,
      store
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

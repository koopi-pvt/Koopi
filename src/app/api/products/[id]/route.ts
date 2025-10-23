import { NextRequest, NextResponse } from 'next/server';
import { adminDb, verifySessionCookie } from '@/lib/firebase-admin';

// GET /api/products/[id] - Get a single product
export async function GET(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase not configured. Please set up your Firebase credentials.' },
        { status: 503 }
      );
    }

    const sessionCookie = request.cookies.get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await verifySessionCookie(sessionCookie);
    const userId = decodedClaims.uid;

    // Get user's store
    const storesSnapshot = await adminDb
      .collection('stores')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (storesSnapshot.empty) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const storeId = storesSnapshot.docs[0].id;

    // Get product
    const id = request.nextUrl.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Product ID not found in URL' }, { status: 400 });
    }
    
    const productDoc = await adminDb.collection('products').doc(id).get();

    if (!productDoc.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = productDoc.data();

    // Verify product belongs to user's store
    if (product?.storeId !== storeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({
      product: { id: productDoc.id, ...product }
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase not configured. Please set up your Firebase credentials.' },
        { status: 503 }
      );
    }

    const sessionCookie = request.cookies.get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await verifySessionCookie(sessionCookie);
    const userId = decodedClaims.uid;

    // Get user's store
    const storesSnapshot = await adminDb
      .collection('stores')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (storesSnapshot.empty) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const storeId = storesSnapshot.docs[0].id;

    // Get existing product
    const id = request.nextUrl.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Product ID not found in URL' }, { status: 400 });
    }

    const productDoc = await adminDb.collection('products').doc(id).get();

    if (!productDoc.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const existingProduct = productDoc.data();

    // Verify product belongs to user's store
    if (existingProduct?.storeId !== storeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updates = await request.json();

    // Don't allow changing storeId, createdAt
    delete updates.storeId;
    delete updates.createdAt;

    // Update product
    const updatedProduct = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection('products').doc(id).update(updatedProduct);

    return NextResponse.json({
      success: true,
      product: { id, ...existingProduct, ...updatedProduct }
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase not configured. Please set up your Firebase credentials.' },
        { status: 503 }
      );
    }

    const sessionCookie = request.cookies.get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await verifySessionCookie(sessionCookie);
    const userId = decodedClaims.uid;

    // Get user's store
    const storesSnapshot = await adminDb
      .collection('stores')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (storesSnapshot.empty) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const storeId = storesSnapshot.docs[0].id;

    // Get product
    const id = request.nextUrl.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Product ID not found in URL' }, { status: 400 });
    }

    const productDoc = await adminDb.collection('products').doc(id).get();

    if (!productDoc.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = productDoc.data();

    // Verify product belongs to user's store
    if (product?.storeId !== storeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete product
    await adminDb.collection('products').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product', details: error.message },
      { status: 500 }
    );
  }
}

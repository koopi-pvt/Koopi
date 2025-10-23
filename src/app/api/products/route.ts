import { NextRequest, NextResponse } from 'next/server';
import { adminDb, verifySessionCookie } from '@/lib/firebase-admin';

// GET /api/products - List all products for the store
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';

    // Query products
    let query = adminDb
      .collection('products')
      .where('storeId', '==', storeId);

    if (status) {
      query = query.where('status', '==', status);
    }

    if (type) {
      query = query.where('type', '==', type);
    }

    const productsSnapshot = await query.orderBy('createdAt', 'desc').get();

    let products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Client-side search filter (since Firestore doesn't support full-text search)
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter((product: any) =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.vendor?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
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

    const productData = await request.json();

    // Validate required fields
    if (!productData.name || !productData.type || productData.price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, price' },
        { status: 400 }
      );
    }

    // Prepare product document
    const product = {
      ...productData,
      storeId,
      userId,
      averageRating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create product in Firestore
    const productRef = await adminDb.collection('products').add(product);

    return NextResponse.json({
      success: true,
      productId: productRef.id,
      product: { id: productRef.id, ...product }
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}

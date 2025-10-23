import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      storeId,
      storeSlug,
      customerInfo,
      items,
      paymentMethod,
      total,
      notes,
      currency,
    } = body;

    // Validate required fields
    if (!storeId || !customerInfo || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order document
    const orderData = {
      orderId,
      storeId,
      storeSlug,
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        postalCode: customerInfo.postalCode || '',
        country: customerInfo.country,
      },
      items: items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        selectedAttributes: item.selectedAttributes || {},
        image: item.image || '',
      })),
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'unpaid',
      orderStatus: 'pending',
      total,
      currency: currency || 'USD',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firestore
    const orderRef = await adminDb.collection('orders').add(orderData);

    // TODO: Send order confirmation email to customer
    // TODO: Send order notification email to store owner

    return NextResponse.json({
      success: true,
      orderId,
      orderRef: orderRef.id,
      message: 'Order placed successfully',
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET - Fetch orders (for store owner)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }

    const ordersSnapshot = await adminDb
      .collection('orders')
      .where('storeId', '==', storeId)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

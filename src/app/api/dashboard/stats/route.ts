import { NextResponse, NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
  if (!adminDb) {
    return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
  }
  try {
    const sessionCookie = request.cookies.get('session')?.value || '';
    const decodedToken = await getAuth().verifySessionCookie(sessionCookie, true);
    const userId = decodedToken.uid;

    const productsRef = adminDb.collection('products').where('userId', '==', userId);
    const productsSnapshot = await productsRef.get();

    let totalProducts = 0;
    let activeProducts = 0;
    let totalStock = 0;

    productsSnapshot.forEach((doc: QueryDocumentSnapshot) => {
      const product = doc.data();
      totalProducts++;
      if (product.status === 'Active') {
        activeProducts++;
      }
      if (product.inventoryTracked && product.quantity) {
        totalStock += product.quantity;
      }
    });

    // Fetch Orders Stats
    const ordersRef = adminDb.collection('orders').where('userId', '==', userId);
    const ordersSnapshot = await ordersRef.get();

    const totalOrders = ordersSnapshot.size;
    let totalRevenue = 0;
    const customerIds = new Set<string>();

    ordersSnapshot.forEach((doc: QueryDocumentSnapshot) => {
      const order = doc.data();
      if (order.totalAmount) {
        totalRevenue += order.totalAmount;
      }
      if (order.customerId) {
        customerIds.add(order.customerId);
      }
    });

    const totalCustomers = customerIds.size;

    return NextResponse.json({
      totalProducts,
      activeProducts,
      totalStock,
      totalOrders,
      totalRevenue,
      totalCustomers,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
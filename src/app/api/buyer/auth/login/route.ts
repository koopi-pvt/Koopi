import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Query Firestore for buyer with matching email
    const buyersSnapshot = await adminDb
      .collection('buyers')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (buyersSnapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const buyerDoc = buyersSnapshot.docs[0];
    const buyerData = buyerDoc.data();

    // In production, use proper password hashing (bcrypt)
    // For now, simple comparison (NOT SECURE - DEMO ONLY)
    if (buyerData.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...buyer } = buyerData;

    return NextResponse.json({
      success: true,
      buyer: {
        id: buyerDoc.id,
        ...buyer,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      );
    }

    // Verify user exists and get their data
    try {
      const userRecord = await adminAuth.getUserByEmail(email);
      
      // Get user data from Firestore
      const userDoc = await adminDb.collection('users').doc(userRecord.uid).get();
      
      if (!userDoc.exists) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const userData = userDoc.data();

      // Check if user is a customer
      if (userData?.role !== 'customer') {
        return NextResponse.json(
          { error: 'Invalid account type. Please use store owner login.' },
          { status: 403 }
        );
      }

      // Return success (client will handle Firebase auth)
      return NextResponse.json({
        success: true,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userData.displayName || userData.name,
        },
      });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Customer login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

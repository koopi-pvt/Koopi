import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingBuyer = await adminDb
      .collection('buyers')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (!existingBuyer.empty) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create new buyer
    // In production, hash password with bcrypt
    const newBuyer = {
      email: email.toLowerCase(),
      password, // NOT SECURE - Should be hashed in production
      name,
      phone: phone || '',
      photoURL: '',
      addresses: [],
      defaultAddressId: '',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection('buyers').add(newBuyer);

    // Remove password from response
    const { password: _, ...buyerResponse } = newBuyer;

    return NextResponse.json(
      {
        success: true,
        buyer: {
          id: docRef.id,
          ...buyerResponse,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

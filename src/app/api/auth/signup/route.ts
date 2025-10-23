import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { validateSlug, generateSubdomain } from '@/utils/slugValidation';
import { SignupData } from '@/types/auth';
import { sendVerificationEmail, sendWelcomeEmail } from '@/lib/sendgrid';

export async function POST(request: NextRequest) {
  try {
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      );
    }

    const data: SignupData = await request.json();

    // Validate required fields
    if (!data.email || !data.password || !data.displayName || !data.storeName || !data.storeSlug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate slug
    const slugValidation = validateSlug(data.storeSlug);
    if (!slugValidation.valid) {
      return NextResponse.json(
        { error: slugValidation.error },
        { status: 400 }
      );
    }

    // Check if slug is available
    const slugDoc = await adminDb.collection('slugs').doc(data.storeSlug.toLowerCase()).get();
    if (slugDoc.exists) {
      return NextResponse.json(
        { error: 'This store slug is already taken' },
        { status: 400 }
      );
    }

    // Create user in Firebase Auth
    let userRecord;
    try {
      userRecord = await adminAuth.createUser({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        emailVerified: false,
      });
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'auth/email-already-exists'
      ) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        );
      }
      throw error;
    }

    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now

    // Create user document in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: data.email,
      displayName: data.displayName,
      phoneNumber: data.phoneNumber || null,
      emailVerified: false,
      onboardingCompleted: true,
      createdAt: now,
      updatedAt: now,
    });

    // Generate store ID
    const storeRef = adminDb.collection('stores').doc();
    const storeId = storeRef.id;

    // Create store document
    await storeRef.set({
      storeId,
      userId: userRecord.uid,
      storeName: data.storeName,
      storeSlug: data.storeSlug.toLowerCase(),
      description: data.storeDescription || null,
      categories: data.categories || [],
      shippingLocations: data.shippingLocations || [],
      returnPolicy: data.returnPolicy || null,
      businessHours: data.businessHours || null,
      businessInfo: data.businessInfo || null,
      subdomain: generateSubdomain(data.storeSlug.toLowerCase()),
      customDomain: null,
      plan: 'trial',
      trialEndsAt,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    // Reserve the slug
    await adminDb.collection('slugs').doc(data.storeSlug.toLowerCase()).set({
      slug: data.storeSlug.toLowerCase(),
      storeId,
      userId: userRecord.uid,
      createdAt: now,
    });

    // Generate custom token for client-side auth
    const customToken = await adminAuth.createCustomToken(userRecord.uid);

    // Generate store URL and dashboard URL
    const storeUrl = `https://${data.storeSlug.toLowerCase()}.${process.env.NEXT_PUBLIC_BASE_DOMAIN || 'koopi.com'}`;
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/en/dashboard`;

    // Send verification email (non-blocking - fire and forget)
    adminAuth.generateEmailVerificationLink(data.email).then(async (link) => {
      // Send verification email via SendGrid
      await sendVerificationEmail({
        to: data.email,
        displayName: data.displayName,
        verificationLink: link,
      });

      // Also send welcome email
      await sendWelcomeEmail({
        to: data.email,
        displayName: data.displayName,
        storeName: data.storeName,
        storeUrl,
        dashboardUrl,
      });

      console.log('Verification and welcome emails sent to:', data.email);
    }).catch((error) => {
      console.error('Failed to send emails:', error);
    });

    return NextResponse.json(
      {
        message: 'Account created successfully',
        customToken,
        userId: userRecord.uid,
        storeId,
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

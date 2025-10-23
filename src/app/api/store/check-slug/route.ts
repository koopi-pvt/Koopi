import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { validateSlug } from '@/utils/slugValidation';

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    // Validate slug format
    const validation = validateSlug(slug);
    if (!validation.valid) {
      return NextResponse.json(
        { available: false, error: validation.error },
        { status: 400 }
      );
    }

    // If Firebase is not configured, return available for development
    if (!adminDb) {
      console.log('Firebase not configured, allowing slug:', slug);
      return NextResponse.json({ available: true }, { status: 200 });
    }

    // Check if slug exists in database
    const slugDoc = await adminDb.collection('slugs').doc(slug.toLowerCase()).get();

    if (slugDoc.exists) {
      return NextResponse.json({ available: false }, { status: 200 });
    }

    return NextResponse.json({ available: true }, { status: 200 });
  } catch (error) {
    console.error('Slug check error:', error);
    // Return available on error for better UX during development
    return NextResponse.json({ available: true }, { status: 200 });
  }
}

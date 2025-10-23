import { NextRequest, NextResponse } from 'next/server';
import { adminDb, verifySessionCookie } from '@/lib/firebase-admin';
import { uploadImageToSupabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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

    const storeDoc = storesSnapshot.docs[0];
    const storeId = storeDoc.id;

    const formData = await request.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image size must be less than 5MB' }, { status: 400 });
    }

    // Prepare file for upload
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop();
    const fileName = `store-logos/${storeId}-${uuidv4()}.${fileExtension}`;
    
    // Upload to Supabase Storage
    const { url } = await uploadImageToSupabase(
      fileBuffer,
      fileName,
      file.type,
      true // Use admin client
    );

    // Update store with logo URL
    await adminDb.collection('stores').doc(storeId).update({
      logoUrl: url,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ logoUrl: url });
  } catch (error: any) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { error: 'Failed to upload logo', details: error.message },
      { status: 500 }
    );
  }
}

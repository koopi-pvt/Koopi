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

    const storeId = storesSnapshot.docs[0].id;

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Prepare file for upload
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop();
    const fileName = `${storeId}/${uuidv4()}.${fileExtension}`;
    
    // Upload to Supabase Storage
    const { url } = await uploadImageToSupabase(
      fileBuffer,
      fileName,
      file.type,
      true // Use admin client
    );

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error.message },
      { status: 500 }
    );
  }
}
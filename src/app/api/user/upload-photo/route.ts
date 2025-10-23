import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { uploadImageToSupabase, deleteImageFromSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(session.value, true);
    const formData = await request.formData();
    const file = formData.get('photo') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Get old photo URL to delete from Supabase
    const userDoc = await adminDb.collection('users').doc(decodedClaims.uid).get();
    const oldPhotoURL = userDoc.data()?.photoURL;

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `profile-photos/${decodedClaims.uid}-${timestamp}.${fileExtension}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase
    const { url } = await uploadImageToSupabase(
      buffer,
      fileName,
      file.type,
      true // use admin client
    );

    // Delete old photo from Supabase if it exists and is a Supabase URL
    if (oldPhotoURL && oldPhotoURL.includes('supabase.co')) {
      try {
        // Extract file path from URL
        const urlParts = oldPhotoURL.split('/');
        const pathStartIndex = urlParts.findIndex(part => part === 'product-images');
        if (pathStartIndex !== -1) {
          const oldFilePath = urlParts.slice(pathStartIndex + 1).join('/');
          await deleteImageFromSupabase(oldFilePath);
        }
      } catch (deleteError) {
        console.error('Error deleting old photo:', deleteError);
        // Continue even if deletion fails
      }
    }

    // Update user photoURL in Firestore
    await adminDb.collection('users').doc(decodedClaims.uid).set(
      { 
        photoURL: url,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      photoURL: url,
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' }, 
      { status: 500 }
    );
  }
}
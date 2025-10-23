import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// POST - Create a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, senderId, senderType, senderName, message } = body;

    // Validate required fields
    if (!orderId || !senderId || !senderType || !senderName || !message) {
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

    // Create message document
    const messageData = {
      orderId,
      senderId,
      senderType,
      senderName,
      message: message.trim(),
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    };

    const messageRef = await adminDb.collection('messages').add(messageData);

    // TODO: Send push notification or email notification to the other party

    return NextResponse.json({
      success: true,
      messageId: messageRef.id,
      message: 'Message sent successfully',
    });
  } catch (error: any) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}

// GET - Fetch messages for an order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }

    const messagesSnapshot = await adminDb
      .collection('messages')
      .where('orderId', '==', orderId)
      .orderBy('createdAt', 'asc')
      .get();

    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

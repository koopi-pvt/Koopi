// Message types for real-time order messaging

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderType: 'buyer' | 'seller';
  senderName: string;
  message: string;
  createdAt: any; // Firestore Timestamp
  read?: boolean;
}

export interface CreateMessageData {
  orderId: string;
  senderId: string;
  senderType: 'buyer' | 'seller';
  senderName: string;
  message: string;
}

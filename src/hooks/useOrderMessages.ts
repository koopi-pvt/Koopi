'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/types/message';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

export function useOrderMessages(orderId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('orderId', '==', orderId),
        orderBy('createdAt', 'asc')
      );

      // Real-time listener
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedMessages: Message[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            fetchedMessages.push({
              id: doc.id,
              orderId: data.orderId,
              senderId: data.senderId,
              senderType: data.senderType,
              senderName: data.senderName,
              message: data.message,
              createdAt: data.createdAt,
              read: data.read || false,
            });
          });
          setMessages(fetchedMessages);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching messages:', err);
          setError('Failed to load messages');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up message listener:', err);
      setError('Failed to setup message listener');
      setLoading(false);
    }
  }, [orderId]);

  return { messages, loading, error };
}

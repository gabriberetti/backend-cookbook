'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BackendEvent } from '@/types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<BackendEvent[]>([]);

  useEffect(() => {
    const socket = io(WS_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('backend-event', (event: BackendEvent) => {
      setEvents((prev) => [event, ...prev].slice(0, 200));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { connected, events, socket: socketRef.current };
}

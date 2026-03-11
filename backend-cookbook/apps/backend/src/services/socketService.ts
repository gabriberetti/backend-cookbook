import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { config } from '../config';
import { eventService, BackendEvent } from './eventService';

let io: SocketServer | null = null;

export function initSocketServer(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: config.frontendUrl,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  eventService.on('backend-event', (event: BackendEvent) => {
    io?.emit('backend-event', event);
  });

  console.log('[Socket.io] Server initialized');
  return io;
}

export function getSocketServer(): SocketServer | null {
  return io;
}

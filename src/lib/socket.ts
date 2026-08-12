import { io, Socket } from 'socket.io-client';

let chatSocket: Socket | null = null;
let notifSocket: Socket | null = null;

export function connectSockets(token: string) {
  if (chatSocket?.connected && notifSocket?.connected) return;

  const opts = {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  };
  const wsBase = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:3000';

  if (!chatSocket) {
    chatSocket = io(`${wsBase}/chat`, opts);
    chatSocket.on('connect_error', () => {
      // Quietly handle connection retry without logging errors to console during page navigation
    });
  }

  if (!notifSocket) {
    notifSocket = io(`${wsBase}/notifications`, opts);
    notifSocket.on('connect_error', () => {
      // Quietly handle connection retry without logging errors to console during page navigation
    });
  }
}

export function disconnectSockets() {
  chatSocket?.disconnect();
  notifSocket?.disconnect();
  chatSocket = null;
  notifSocket = null;
}

export function getChatSocket() { return chatSocket; }
export function getNotifSocket() { return notifSocket; }

// Cleanly disconnect when browser tab enters BFCache or page unloads
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => disconnectSockets());
  window.addEventListener('freeze', () => disconnectSockets());
}

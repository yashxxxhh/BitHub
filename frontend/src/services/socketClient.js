import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const joinRoom = (roomId, userId, username) => {
  getSocket().emit('join_room', { roomId, userId, username });
};

export const emitCodeChange = (roomId, code) => {
  getSocket().emit('code_change', { roomId, code });
};

export const emitCursorMove = (roomId, cursor, username, color) => {
  getSocket().emit('cursor_move', { roomId, cursor, username, color });
};

export const emitLanguageChange = (roomId, language) => {
  getSocket().emit('language_change', { roomId, language });
};

export const sendChatMessage = (roomId, message, username, color) => {
  getSocket().emit('send_message', { roomId, message, username, color });
};

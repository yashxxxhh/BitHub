const {
  getRoomCode,
  updateRoomCode,
  addUserToRoom,
  removeUserFromRoom,
  getActiveUsers,
  findRoomBySocketId,
} = require('../services/editorService');

/**
 * Socket Manager
 * Handles all real-time WebSocket events for BitHub.
 *
 * Events:
 *  Client → Server: join_room, code_change, cursor_move, leave_room, send_message
 *  Server → Client: sync_code, user_joined, user_left, code_updated, cursor_updated,
 *                   active_users, receive_message, error
 */

const initSocketManager = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // ─── JOIN ROOM ──────────────────────────────────────────────────────
    socket.on('join_room', ({ roomId, userId, username }) => {
      if (!roomId || !username) {
        socket.emit('error', { message: 'roomId and username are required.' });
        return;
      }

      socket.join(roomId);

      const userInfo = { socketId: socket.id, userId, username };
      const user = addUserToRoom(roomId, userInfo);

      if (!user) {
        socket.emit('error', { message: 'Room not found.' });
        return;
      }

      // Send current code state to the joining user
      const code = getRoomCode(roomId);
      socket.emit('sync_code', { code });

      // Send current active users to the joining user
      const activeUsers = getActiveUsers(roomId);
      socket.emit('active_users', { users: activeUsers });

      // Notify everyone else in the room
      socket.to(roomId).emit('user_joined', {
        user,
        message: `${username} joined the room`,
      });

      // Update active users list for everyone
      io.to(roomId).emit('active_users', { users: getActiveUsers(roomId) });

      console.log(`[Socket] ${username} joined room ${roomId}`);
    });

    // ─── CODE CHANGE ────────────────────────────────────────────────────
    socket.on('code_change', ({ roomId, code }) => {
      updateRoomCode(roomId, code);

      // Broadcast to everyone else in the room (not the sender)
      socket.to(roomId).emit('code_updated', { code });
    });

    // ─── CURSOR MOVE ────────────────────────────────────────────────────
    socket.on('cursor_move', ({ roomId, cursor, username, color }) => {
      socket.to(roomId).emit('cursor_updated', {
        socketId: socket.id,
        cursor,
        username,
        color,
      });
    });

    // ─── CHAT MESSAGE ────────────────────────────────────────────────────
    socket.on('send_message', ({ roomId, message, username, color }) => {
      if (!message || !message.trim()) return;

      const payload = {
        id: Date.now(),
        username,
        message: message.trim(),
        color,
        timestamp: new Date().toLocaleTimeString(),
      };

      io.to(roomId).emit('receive_message', payload);
    });

    // ─── LANGUAGE CHANGE ────────────────────────────────────────────────
    socket.on('language_change', ({ roomId, language }) => {
      socket.to(roomId).emit('language_changed', { language });
    });

    // ─── DISCONNECT ─────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      const room = findRoomBySocketId(socket.id);
      if (room) {
        const user = removeUserFromRoom(room.id, socket.id);
        if (user) {
          io.to(room.id).emit('user_left', {
            user,
            message: `${user.username} left the room`,
          });
          io.to(room.id).emit('active_users', { users: getActiveUsers(room.id) });
          console.log(`[Socket] ${user.username} left room ${room.id}`);
        }
      }
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = { initSocketManager };

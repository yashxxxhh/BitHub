const store = require('../config/db');

/**
 * EditorService
 * Business logic for editor operations — decoupled from socket/HTTP layers.
 */

const CURSOR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
];

let colorIndex = 0;

const getNextColor = () => {
  const color = CURSOR_COLORS[colorIndex % CURSOR_COLORS.length];
  colorIndex++;
  return color;
};

const getRoomCode = (roomId) => {
  const room = store.rooms.find((r) => r.id === roomId);
  return room ? room.code : null;
};

const updateRoomCode = (roomId, code) => {
  const room = store.rooms.find((r) => r.id === roomId);
  if (room) {
    room.code = code;
    return true;
  }
  return false;
};

const addUserToRoom = (roomId, userInfo) => {
  const room = store.rooms.find((r) => r.id === roomId);
  if (!room) return null;

  // Remove existing entry for this socket (re-join edge case)
  room.activeUsers = room.activeUsers.filter((u) => u.socketId !== userInfo.socketId);

  const color = getNextColor();
  const user = { ...userInfo, color };
  room.activeUsers.push(user);

  return user;
};

const removeUserFromRoom = (roomId, socketId) => {
  const room = store.rooms.find((r) => r.id === roomId);
  if (!room) return null;

  const user = room.activeUsers.find((u) => u.socketId === socketId);
  room.activeUsers = room.activeUsers.filter((u) => u.socketId !== socketId);

  return user;
};

const getActiveUsers = (roomId) => {
  const room = store.rooms.find((r) => r.id === roomId);
  return room ? room.activeUsers : [];
};

const findRoomBySocketId = (socketId) => {
  return store.rooms.find((r) => r.activeUsers.some((u) => u.socketId === socketId));
};

module.exports = {
  getRoomCode,
  updateRoomCode,
  addUserToRoom,
  removeUserFromRoom,
  getActiveUsers,
  findRoomBySocketId,
};

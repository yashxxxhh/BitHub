const Room = require('../models/Room');
const store = require('../config/db');

/**
 * POST /api/rooms/create
 */
const createRoom = (req, res) => {
  try {
    const { name, language } = req.body;
    if (!name) return res.status(400).json({ message: 'Room name is required.' });

    const room = new Room({ name, language, createdBy: req.user.id });
    store.rooms.push(room);

    return res.status(201).json({ message: 'Room created.', room: sanitizeRoom(room) });
  } catch (err) {
    console.error('Create room error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * GET /api/rooms/:id
 */
const getRoom = (req, res) => {
  const room = store.rooms.find((r) => r.id === req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found.' });
  return res.json({ room: sanitizeRoom(room) });
};

/**
 * GET /api/rooms
 */
const listRooms = (req, res) => {
  const rooms = store.rooms.map(sanitizeRoom);
  return res.json({ rooms });
};

/**
 * POST /api/rooms/:id/save
 */
const saveCode = (req, res) => {
  const room = store.rooms.find((r) => r.id === req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found.' });

  const { code } = req.body;
  if (code === undefined) return res.status(400).json({ message: 'Code is required.' });

  room.code = code;
  room.savedAt = new Date().toISOString();

  return res.json({ message: 'Code saved successfully.', savedAt: room.savedAt });
};

const sanitizeRoom = (room) => ({
  id: room.id,
  name: room.name,
  language: room.language,
  code: room.code,
  createdBy: room.createdBy,
  createdAt: room.createdAt,
  activeUsers: room.activeUsers,
});

module.exports = { createRoom, getRoom, listRooms, saveCode };

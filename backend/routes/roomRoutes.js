const express = require('express');
const router = express.Router();
const { createRoom, getRoom, listRooms, saveCode } = require('../controllers/roomController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/create', createRoom);
router.get('/', listRooms);
router.get('/:id', getRoom);
router.post('/:id/save', saveCode);

module.exports = router;

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Player = require('../models/Player');

const router = express.Router();
const JWT_SECRET = 'SecretKey';

//Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await Player.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const player = new Player({ username, passwordHash });
    await player.save();

    res.status(201).json({ message: 'Player registered' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

//Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const player = await Player.findOne({ username });
    if (!player) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, player.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ playerId: player._id }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, username: player.username, chips: player.chips });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
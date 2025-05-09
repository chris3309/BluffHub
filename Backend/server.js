const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const Users = require('./models/user.model');
const Hand = require('./models/hand.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI= process.env.MONGODB_URI;

//const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/signup', async (req,res)=>{
  try {
    console.log(req.body);
    //res.json({ token });
    const user = await Users.create({
      username: req.body.username,
      password: req.body.password,
      coins: 100
    });

    const { username, password } = req.body;

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });

    //res.status(201).json({ token, username: { username } });

    //res.send(req.body)
    //next();
  } catch (err) { //next(err);
    res.status(500).json({message: err.message});
  }
 
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body.user; // match the frontend shape

    // Find user in DB
    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password
    const passwordMatch = password === user.password; // if plain text (NOT recommended!)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: {
        username: user.username
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  console.log('loggin in');
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    // ---------- query‑param handling ----------
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const sortKey = ['wins', 'profit', 'winRate'].includes(req.query.sort)
                   ? req.query.sort
                   : 'profit';
    const days = parseInt(req.query.days, 10);          // undefined ⇒ all‑time

    // ---------- optional date filter ----------
    const matchStage = days
      ? { $match: { createdAt: { $gte: new Date(Date.now() - days*24*60*60*1000) } } }
      : { $match: {} };

    // ---------- aggregation ----------
    const pipeline = [
      matchStage,

      // group by player
      {
        $group: {
          _id: '$username',
          games:  { $sum: 1 },
          wins:   { $sum: { $cond: ['$win', 1, 0] } },
          profit: {                 // +bet if win, ‑bet if loss/tie
            $sum: {
              $cond: [
                '$win',
                '$betAmount',
                { $multiply: ['$betAmount', -1] }
              ]
            }
          }
        }
      },

      // derived fields
      {
        $addFields: {
          winRate: { $divide: ['$wins', '$games'] }
        }
      },

      // choose sort key dynamically
      {
        $sort: {
          [sortKey]: -1,
          games: -1   // secondary sort for stability
        }
      },

      { $limit: limit },

      // rename _id for cleaner output
      {
        $project: {
          _id: 0,
          username: '$_id',
          games: 1,
          wins: 1,
          winRate: { $round: ['$winRate', 3] },
          profit: 1
        }
      }
    ];

    const leaderboard = await Hand.aggregate(pipeline).exec();
    return res.json({ leaderboard });
  } catch (err) {
    console.error('Leaderboard aggregation failed:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/game-results', authenticateToken, async (req, res) => {
  console.log('result recieved');
  console.log(req.body);
  try {
    const username  = req.user.username;   // now guaranteed
    const {
      betAmount,
      bust,
      win,
      handVal
    } = req.body;
    console.log(req.body);

    // quick sanity check
    if (betAmount == null || handVal == null ||
        typeof bust !== 'boolean' || typeof win !== 'boolean') {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    const hand = await Hand.create({ username, betAmount, bust, win, handVal });
    
    return res.status(201).json({ message: 'Round stored', hand });
  } catch (err) {
    console.error('Save game‑result failed:', err);
    console.log(err);
    return res.status(500).json({ message: 'Server error' });
  }
});


mongoose.connect(MONGODB_URI)
  .then(()=>{
    console.log("Connected to database");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }).catch(()=>{
    console.log("Connection failed.");
  })


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // "Bearer TOKEN"

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // contains { username }
    next();
  });
}

// Get current user's coin count
app.get('/api/user/coins', authenticateToken, async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log("Coins sent!");
    res.json({ coins: user.coins });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update coins (e.g., +50 or -10)
app.post('/api/user/coins/update', authenticateToken, async (req, res) => {
  const { delta } = req.body; // positive or negative change

  try {
    const user = await Users.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.coins += delta;
    await user.save();

    res.json({ coins: user.coins });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

//app.use('/api/auth', authRoutes);

//app.use((err, _req, res,next)=>
//  res.status(err.status || 500).json({ message: err.message })
//);




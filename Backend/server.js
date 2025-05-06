const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const Users = require('./models/user.model');
//const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/signup', async (req,res)=>{
  try {
    console.log(req.body);
    //res.json({ token });
    const user = await Users.create(req.body);
    res.send(req.body)
    //next();
  } catch (err) { //next(err);
    res.status(500).json({message: error.message});
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

    res.status(200).json({
      user: {
        username: user.username
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


mongoose.connect('mongodb+srv://christopher:passw0rd@cluster0.pwjrtzs.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0')
  .then(()=>{
    console.log("Connected to database");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }).catch(()=>{
    console.log("Connection failed.");
  })

//app.use('/api/auth', authRoutes);

//app.use((err, _req, res,next)=>
//  res.status(err.status || 500).json({ message: err.message })
//);




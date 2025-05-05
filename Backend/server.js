const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://christopher:passw0rd@cluster0.pwjrtzs.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0')
  .then(()=>{
    console.log("Connected to database");
  }).catch(()=>{
    console.log("Connection failed.");
  })

//app.use('/api/auth', authRoutes);

//app.use((err, _req, res,next)=>
//  res.status(err.status || 500).json({ message: err.message })
//);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
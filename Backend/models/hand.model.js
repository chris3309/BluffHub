const mongoose = require('mongoose');

const HandSchema = mongoose.Schema({
    username : {type: String, required: true },
    betAmount : {type: Number, required: true },
    bust : { type: Boolean, required: true },
    win : { type : Boolean, required: true },
    handVal : { type: Number, required: true }
});
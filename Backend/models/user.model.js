const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    coins: { type: Number, required: true}
});

const Users = mongoose.model('Users', UserSchema);
module.exports = Users
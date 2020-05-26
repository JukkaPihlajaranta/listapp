const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    email: {type: String, unique: true},
    displayName: {type: String},
    password: {type: String},
    admin: {type: Boolean, default: false},
    lastLoggedIn: {type: String},
    sharedLists: [
        { listId: String,
        }]
});

module.exports = mongoose.model('user', User);
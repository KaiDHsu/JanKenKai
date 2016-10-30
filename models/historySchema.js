var mongoose = require('mongoose');
var crypto = require('crypto');

var historySchema = new mongoose.Schema({
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('History', historySchema);

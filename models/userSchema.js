var mongoose = require('mongoose');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hash: String,
    salt: String,
    creation: { type: Date, default: Date.now },
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'History' }]
});

userSchema.methods.crpytPassword = function(pw) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(pw, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.isValidPassword = function(pw) {
    var hash = crypto.pbkdf2Sync(pw, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

mongoose.model('User', userSchema);

var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User')

router.post('/createUser', function(req, res, next) {
    var user = new User();

    user.username = req.body.username;
    user.crpytPassword(req.body.pass);

    user.save(function(err, users) {
        if (err) {
            return next(err);
        }
        res.json(users);
    });
});

router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var pass = req.body.pass;

    User.findOne({ username: username }, function(err, user) {
        if (err) {
            return next(err);
        }
        if(!user) {
            res.send("User not found");
        } else if(user.isValidPassword(pass)) {
            res.send("Successful Login");
        } else {
            res.send("Unsuccessful Login")
        }
    })
});

module.exports = router;

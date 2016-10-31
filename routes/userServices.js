var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');

router.post('/createUser', function(req, res, next) {
    var user = new User();

    user.username = req.body.username;
    user.crpytPassword(req.body.pass);

    user.save()
        .then(function success(resp) {
            var token = jwt.sign(user, req.app.get('secretTokenKey'), { expiresIn: '1h' });
            res.status(201);
            res.send({
                success: true,
                message: "User successfully created.",
                sessionToken: token
            });
        }, function error(err) {
            if (err.code === 11000) {
                res.status(409);
                res.send({
                    success: false,
                    message: 'Username already exists'
                });
            } else {
                res.status(500);
                res.send(err);
            }
        });
});

router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var pass = req.body.pass;

    User.findOne({ username: username })
        .then(function success(resp) {
            var user = resp;
            if (!user) {
                res.status(404);
                res.json({
                    success: false,
                    message: "Username not Found"
                });
            } else if (user.isValidPassword(pass)) {
                var token = jwt.sign(user, req.app.get('secretTokenKey'), { expiresIn: '1h' });
                res.send({
                    success: true,
                    message: "Successful Login",
                    sessionToken: token
                });
            } else {
                res.status(500);
                res.send({
                    success: false,
                    message: "Unsuccessful Login"
                });
            }
        }, function error(err) {
            res.status(500);
            res.send({
                success: false,
                message: "Error Occured."
            });
        });
});

module.exports = router;

/* I feel like I have a lot of code that can be centralized in Middleware. I'll put it on the TODO list for now. */

var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var History = mongoose.model('History');

router.post('/storeScore', function(req, res, next) {
    var history = new History(req.body);

    history.save()
        .then(function success(resp) {
            res.status(201);
            res.send({
                message: "User successfully created."
            });
        }, function error(err) {
            if (err.code === 11000) {
                res.status(409);
                res.send({
                    error: 'Username already exists'
                });
            } else {
                res.status(500);
                res.send(err);
            }
        });
});

router.post('/retreiveHistory', function(req, res, next) {
    var username = req.body.username;
    var pass = req.body.pass;

    History.findOne({ username: username })
        .then(function success(resp) {
            var history = resp;
            if (!history) {
                res.status(404);
                res.send({
                    error: "Username not Found"
                });
            } else if (user.isValidPassword(pass)) {
                res.send({
                    message: "Successful Login"
                });
            } else {
                res.status(500);
                res.send({
                    message: "Unsuccessful Login"
                });
            }
        }, function error(err) {
            res.status(500);
            res.send("error");
        });
});

module.exports = router;

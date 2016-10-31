var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');

router.use(['/storeScore', '/retreiveHistory'], function(req, res, next) {
    var token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, req.app.get('secretTokenKey'), function(err, tokenInfo) {
            if (err) {
                res.status(401);
                res.send({
                    success: false,
                    message: "Failed to authenticate token"
                });
                return res;
            } else {
                req.tokenInfo = tokenInfo['_doc'];
                User.findOne({ username: req.tokenInfo.username })
                    .then(function success(resp) {
                        var user = resp;
                        if (!user) {
                            res.status(404);
                            res.send({
                                success: false,
                                message: "Username not Found"
                            });
                            return res;
                        } else if (user) {
                            req.user = user;
                            next();
                        } else {
                            res.status(500);
                            res.send({
                                success: false,
                                message: "Unsuccessful Login"
                            });
                            return res;
                        }
                    }, function error(err) {
                        res.status(500);
                        res.send({
                            success: false,
                            message: "Error Occured."
                        });
                        return res;
                    });
            }
        })
    }
});

module.exports = router;

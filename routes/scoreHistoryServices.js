var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var History = mongoose.model('History');

router.post('/storeScore', function(req, res, next) {
    var history = new History(req.body);
    history.user = req.user;

    history.save()
        .then(function success(resp) {
            var score = resp;
            req.user.history.push(score);
            /* Is this really how this needs to be done? This seems inefficient. TODO - look into mongoose/mongo structures */
            req.user.save()
                .then(function success(resp) {
                    res.status(201);
                    res.send({
                        success: true,
                        resp: resp,
                        message: "Scores successfully saved."
                    });
                }, function error(err) {
                    res.status(500);
                    res.send({
                        success: false,
                        message: "Error saving scores."
                    });
                });

        }, function error(err) {
            res.status(500);
            res.send({
                success: false,
                message: "Error saving scores."
            });
        });
});

router.get('/retreiveHistory', function(req, res, next) {
    req.user.populate('history', 'wins losses draws date').execPopulate()
        .then(function success(resp) {
            var user = resp;
            if (user) {
                res.send({
                    success: true,
                    message: user.history
                });
            } else {
                res.status(500);
                res.send({
                    success: false,
                    message: "Error Occured."
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

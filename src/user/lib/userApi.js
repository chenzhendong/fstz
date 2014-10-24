'use strict';

var model = require('./userModel');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var api = global.apiMgr.api;

api.getUsers = function(req, res, next) {
    res.send('Hello, world!!!');
};

api.login = function(req, res, next) {
    var form = req.body;
    
    User.findOne({email: form.username}, function(err, user) {
            if (err) {
                return next(err);
            } else if (!user) {
                res.send({
                    user: undefined,
                    error:new Error('User with email [' + form.username + '] is not existing ...', 401)
                });
            } else {
                res.send({user: user});
            }
        });
};

api.register = function(req, res, next) {
    var form = req.body;
    var user = new User({
        name: form.name,
        email: form.email,
        password: form.password
    });
    
    User.findOne({email: form.email}).remove().exec();

    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    res.status(400).send([{
                        msg: 'Email already exists.',
                        param: 'email'
                    }]);
                    break;
                default:
                    var modelErrors = [];

                    if (err.errors) {

                        for (var x in err.errors) {
                            modelErrors.push({
                                param: x,
                                msg: err.errors[x].message,
                                value: err.errors[x].value
                            });
                        }

                        res.status(400).send(modelErrors);
                    }
            }

            return res.status(400);
        }
        res.status(200).send({
            user: user
        }).end();
    });
};

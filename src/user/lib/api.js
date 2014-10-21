'use strict';

var model = require('./model');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var api = global.apiMgr.api;

api.getUsers = function(req, res, next) {
    res.send('Hello, world!!!');
};

api.login = function(req, res, next) {
    var loginForm = req.body;
    var username = loginForm.username;
    var password = loginForm.password;
    
    User
        .findOne({email: username})
        .exec(function(err, user) {
          if (err) return next(err);
          if (!user) return next(new Error('Failed to load User by email' + username));
          req.profile = user;
          next();
        });
    
    res.send({
        loginForm: loginForm
    });
};

api.register = function(req, res, next) {
    var registerForm = req.body;
    
    res.send({
        registerForm: registerForm
    });
};


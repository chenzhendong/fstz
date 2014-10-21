'use strict';

var restRoute = function(server) {
    require('./api');
    server.addRestRoute('/users', 'getUsers');
    server.addRestRoute('/login', 'login');
    server.addRestRoute('/register', 'register');
}

module.exports = restRoute;

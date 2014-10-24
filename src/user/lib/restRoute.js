'use strict';

var restRoute = function(server) {
    require('./userApi');
    server.addRestRoute('/users', 'getUsers');
    server.addRestRoute('/login', 'login');
    server.addRestRoute('/register', 'register');
}

module.exports = restRoute;

'use strict';

function Route(){

    this.rest = {
        '/users': {
            api: 'getUsers',
            roles: ['admin']
        },
        '/profile': {
            api: 'profileRest',
            roles: ['user']
        },
        '/login':  {
            api: 'loginRest'
        },
        '/register':  {
            api: 'registerRest'
        }
    };
    
    this.web = {
    };

}

module.exports = new Route();

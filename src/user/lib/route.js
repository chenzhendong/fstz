'use strict';

function Route(){

    this.rest = {
        '/all': {
            api: 'getUsersRest',
            roles: ['admin']
        },
        '/update/:id': {
            api: 'adminUpdateUserRest',
            roles: ['admin']
        },
        '/add': {
            api: 'adminAddUserRest',
            roles: ['admin']
        },
        '/profile': {
            api: 'profileRest',
            roles: ['user']
        },
        '/login':  {
            api: 'loginRest'
        },
        '/register': {
            api: 'registerRest'
        }
    };
    
    this.web = {
    };

}

module.exports = new Route();

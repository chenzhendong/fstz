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
        '/login': {
            api: 'loginWeb',
            view: 'login.swig.html'
        }
    };

}

module.exports = new Route();

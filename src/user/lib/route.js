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
        '/userManager': {
            api: 'getUsersWeb',
            view: 'userManager.swig.html',
            roles: ['admin']
        },
        '/login': {
            api: 'loginWeb',
            view: 'login.swig.html'
        },
         '/profile': {
            api: 'profileWeb',
            view: 'profile.swig.html'
        }
    };

}

module.exports = new Route();

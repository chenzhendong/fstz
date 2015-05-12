'use strict';

module.exports = {
    rest: {},
    web: {
        '/index': {
            'api': 'homePage',
            'view': 'index.swig.html'
        },
        '/about': {
            'api': 'homePage',
            'view': 'about.swig.html'
        },
        '/error': {
            'api': 'emptyModel',
            'view': 'error.swig.html'
        }
        
    }
};

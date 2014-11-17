'use strict';

module.exports = {
    rest: {},
    web: {
        '/index.html': {
            'api': 'homePage',
            'view': 'index.swig.html'
        },
        '/about.html': {
            'api': 'homePage',
            'view': 'about.swig.html'
        },
        '/error.html': {
            'api': 'homePage',
            'view': 'error.swig.html'
        }
        
    }
};

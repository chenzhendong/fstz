'use strict';

function Route(){

    this.rest = {
        
    };
    
    this.web = {
        '/index.html': {
            api: 'homePage',
            view: 'index.html'
        }
    };

}

module.exports = new Route();

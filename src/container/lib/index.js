'use strict';
var path = require('path');

function Container(){
    var prjRoot = path.resolve(__dirname, '..', '..', '..');
    this.envMgr = require('./envMgr');
    this.server = require('./server');
    this.authMgr = require('./authMgr');
    this.modules = {};
    
    //mapping bower to /public/js/lib
    this.server.mappingStaticResource(path.resolve(prjRoot, 'bower_components'), '/public/lib');
}

Container.prototype.register = function(module){
    module.container = this;
    this.modules[module.name] = module;
    this.server.mappingStaticResource(path.resolve(module.libPath, '..', 'public'), '/public');
    if(module.restRoute){
        this.server.addRestRoutesFromModule(module.restRoute);
    }
}

var container = 

module.exports = new Container();

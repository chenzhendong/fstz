'use strict';
var path = require('path');

function ModuleMgr() {
    global.container = this;
    
    /*Initialize Mgrs, sequence is important, reflect dependencies*/
    this.modules = {};
    
    global.envMgr = require('./envMgr');
    global.logMgr = require('./logMgr');
    global.errMgr = require('./errMgr');
    global.dbMgr = require('./dbMgr');
    
    global.cacheMgr = require('./cacheMgr');
    global.authMgr = require('./authMgr');
    
    global.apiMgr = require('./apiMgr');
    global.routeMgr = require('./routeMgr');
    global.server = require('./server');
    
}

ModuleMgr.prototype.register = function(module) {
    
    this.modules[module.name] = module;
    
    module.init();
    global.routeMgr.register(module);
    
    //Mapping contents in public directory under module directory to /public url 
    global.server.mappingStaticResource(path.resolve(module.libPath, '..', 'public'), '/public');

    
};

ModuleMgr.prototype.startServer = function(){
    global.server.listen();
};


module.exports = new ModuleMgr();

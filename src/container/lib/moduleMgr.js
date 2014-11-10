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
    
    global.routeMgr = require('./routeMgr');
    global.server = require('./server');
    
}

ModuleMgr.prototype.register = function(myModule) {
    
    this.modules[myModule.name] = myModule;
    
    myModule.rootPath = path.resolve(myModule.libPath, '..');
    myModule.model = require(path.resolve(myModule.libPath, 'model'));
    myModule.api = require(path.resolve(myModule.libPath, 'api'));
    myModule.route = require(path.resolve(myModule.libPath, 'route'));
    
    global.routeMgr.register(myModule);
    
    //Mapping contents in public directory under module directory to /public url 
    global.server.mappingStaticResource(path.resolve(myModule.libPath, '..', 'public'), '/public');

    
};

ModuleMgr.prototype.startServer = function(){
    global.server.listen();
};


module.exports = new ModuleMgr();

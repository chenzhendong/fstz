'use strict';
var path = require('path');
    
function ModuleMgr() {
    global.container = this;

    /*Initialize container, the sequence of utilities loading is important, which reflects the dependencies*/
    this.modules = {};

    global.envMgr = this.envMgr = require('./envMgr');
    global.logMgr = this.logMgr = require('./logMgr');
    global.errMgr = this.errMgr = require('./errMgr');
    global.dbMgr = this.dbMgr = require('./dbMgr');
    global.cacheMgr = this.cacheMgr = require('./cacheMgr');
    global.authMgr = this.authMgr = require('./authMgr');
    global.routeMgr = this.routeMgr = require('./routeMgr');
    global.server = this.server = require('./server');
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

ModuleMgr.prototype.startServer = function() {
    global.server.listen();
};

module.exports = new ModuleMgr();

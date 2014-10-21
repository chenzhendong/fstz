'use strict';

function ApiMgr() {
    this.api = {};
    global.apiMgr = this;
}

ApiMgr.prototype.add = function(apiName, apiFunc){
    this.api[apiName]=apiFunc;
}

ApiMgr.prototype.get = function(apiName){
    return this.api[apiName];
}


module.exports = new ApiMgr();
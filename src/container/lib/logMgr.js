'use strict';
var log4js = require('log4js'); 

function LogMgr(){
}

LogMgr.prototype.getLogger = function(loggerName){
    return log4js.getLogger(loggerName);    
}

module.exports = new LogMgr();
'use strict';
var log4js = require('log4js'); 

function LogMgr(){
}

LogMgr.prototype.getLogger = function(loggerName){
    //TODO: Read log level from env
    var log = log4js.getLogger(loggerName);    
    log.setLevel('INFO');
    return log;
}

module.exports = new LogMgr();
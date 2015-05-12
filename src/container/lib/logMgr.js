'use strict';
var log4js = require('log4js'); 
var nconf = require('./envMgr').nconf;

function LogMgr(){
}

LogMgr.prototype.getLogger = function(loggerName){
    var log = log4js.getLogger(loggerName);
    var level = nconf.get('log:level');
    if(level){
        log.setLevel(level);
    } else {
        log.setLevel('INFO');
    }
    return log;
}

module.exports = new LogMgr();

/*
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');
*/
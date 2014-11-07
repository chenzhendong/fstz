'use strict';
var NodeCache = require('node-cache'),
   log = require('./logMgr').getLogger('cachMgr');

function CacheMgr(){
    this.cache = new NodeCache( { stdTTL: 1800, checkperiod: 120 } );
}

CacheMgr.prototype.set = function(key, obj){
  log.debug('Saving object ['+ obj +'] with key  ['+ key +'] on cache ...');
  return this.cache.set(key, obj);  
};

CacheMgr.prototype.get = function(key){
  var obj = this.cache.get(key);
  if(obj){
    obj = obj[key];
    log.debug('Retrieve user from cache as ['+ obj +'] from key ['+ key +']...');
  }
  return obj;
};


module.exports = new CacheMgr();
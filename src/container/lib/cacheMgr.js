'use strict';
var NodeCache = require('node-cache'),
   log = require('./logMgr').getLogger('cachMgr');

function CacheMgr(){
    this.cache = new NodeCache( { stdTTL: 1800, checkperiod: 120 } );
}

CacheMgr.prototype.set = function(key, obj, ttl){
  log.trace('Saving object ['+ obj +'] with key  ['+ key +'] on cache ...');
  return this.cache.set(key, obj, ttl);  
};

CacheMgr.prototype.get = function(key){
  var obj = this.cache.get(key);
  if(obj){
    obj = obj[key];
    log.trace('Retrieve user from cache as ['+ obj +'] from key ['+ key +']...');
  }
  return obj;
};


module.exports = new CacheMgr();

/*
node-cache Document Abstraction
Since 1.0.0:
Callback is now optional. You can also use synchronous syntax.

Store a key (SET):
myCache.set( key, val, [ ttl ], [callback] )
Sets a key value pair. It is possible to define a ttl (in seconds).
Returns true on success.

Retrieve a key (GET):
myCache.get( key, [callback] )
Gets a saved value from the cache. Returns an empty object {} if not found or expired. If the value was found it returns an object with the key value pair.

Delete a key (DEL):
myCache.del( key, [callback] )
Delete a key. Returns the number of deleted entries. A delete will never fail.

*/
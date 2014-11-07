'use strict';
var mongoose = require('mongoose');
var envMgr = require('./envMgr');
var log = require('./logMgr').getLogger('dbMgr');

function DbMgr() {
    this.mongoose = mongoose;
    var connection = mongoose.connection;
    var dbUrl = envMgr.nconf.get('database:mongo:dbUrl');
    log.info('Connecting to Database by Url:['+dbUrl+']...');
    mongoose.connect(dbUrl);
    
    // CONNECTION EVENTS
    // When successfully connected
    connection.on('connected', function () {
      log.info('Mongoose default connection open to ' + dbUrl);
    });
    
    // If the connection throws an error
    connection.on('error',function (err) {
      log.error('Mongoose default connection error: ' + err);
    });
    
    // When the connection is disconnected
    connection.on('disconnected', function () {
      log.info('Mongoose default connection disconnected');
    });
    
    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function() {
      connection.close(function () {
        log.info('Mongoose default connection disconnected through app termination');
        process.exit(0);
      });
    });
}



module.exports = new DbMgr();
'use strict';
var log = require('./logMgr').getLogger('errMgr');

function ErrMgr() {
    
}

ErrMgr.prototype.handleError = function (err, req, res) {

    if(!err) {
        log.error('Unkown error with undefined error entity.');
        return;
    }
    
    if(!err.level){
        err.level = 'error';
    }
    
    if(!err.httpStatusCode){
        err.httpStatusCode = 500;
    }
    
    err.isRestfulSvc = req.isRestful;
    
    log[err.level](err.message);
    
    if (err.isRestfulSvc) {
        res.status(err.httpStatusCode).send({
            message: err.message 
        }).end();
    }
    else {
        res.redirect('/web/error');
    }
};

module.exports = new ErrMgr();
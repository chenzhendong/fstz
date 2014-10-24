'use strict';

function ErrMgr(){
    
}

ErrMgr.prototype.handleRestError = function(err, req, res, next){
    //console.log('Sending error with code ['+err.code+']...');
    if(err.msg){
        console.log('Caused by ['+err.reason+']...');
    }
    
}

module.exports = new ErrMgr();
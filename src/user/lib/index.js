'use strict';

function UserModule(){
    this.name = 'user';
    this.libPath = __dirname;
}


module.exports = new UserModule();

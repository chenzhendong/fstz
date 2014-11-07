'use strict';
var fs = require('fs'),
    path = require('path'),
    nconf = require('nconf');


function EnvMgr() {

    this.nconf = nconf;
    //Locate config Directory
    var projectRootDirectory = path.resolve(__dirname, '../../../');
    console.log('Project root directory is: ' + projectRootDirectory);
    var configProfileDirectory = path.resolve(projectRootDirectory, 'config/profile');
    nconf.argv().env();


    //Load Profile such as 'development', 'production', which will override 'default'
    var envProfile = nconf.get('NODE_ENV');
    this.PROFILE_STORE = envProfile;
    if(this.PROFILE_STORE){
        console.log('Current environment profile is: ' + this.PROFILE_STORE);
    } else {
        console.log('Env does not define Current environment profile, default profile will be used...');
    }
    
    if (configProfileDirectory && fs.existsSync(configProfileDirectory)) {

        if(this.PROFILE_STORE){
            var envProfilePath = path.resolve(configProfileDirectory, envProfile + '.json');
            console.log('Loading profile on path [' + envProfilePath + ']...');
            if (fs.existsSync(envProfilePath)) {
                nconf.add(this.PROFILE_STORE, {
                    type: 'file',
                    file: envProfilePath
                });
            }
        }

        var defaultProfilePath = path.resolve(configProfileDirectory, 'default.json');
        console.log('Loading profile on path [' + defaultProfilePath + ']...');
        if (fs.existsSync(defaultProfilePath)) {
            nconf.add('default', {
                type: 'file',
                file: defaultProfilePath
            });
        }

    }
}

EnvMgr.prototype.ENV_STORE = 'env';
EnvMgr.prototype.ARGV_STORE = 'argv';
EnvMgr.prototype.DEFAULT_STORE = 'default';


module.exports = new EnvMgr();

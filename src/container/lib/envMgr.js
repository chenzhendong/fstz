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
    
    /** Setup nconf to use (in-order):
     * 1. Command-line arguments
     * 2. Environment variables
     * 3. Profile variables like 'development', 'production'
     * 4. variables in default profile
     */
    nconf.argv().env();


    /** Load profiles such as 'development', 'production', which will override 'default', 
     * the profile name is defined in system env as 'NODE_ENV', 
     * the profile configuration json file is on <project_root>/config/profile directory
     * */
    var envProfile = nconf.get('NODE_ENV');
    this.PROFILE_STORE = envProfile;
    if(this.PROFILE_STORE){
        console.log('Current environment profile is: ' + this.PROFILE_STORE);
    } else {
        console.log('Env does not define Current environment profile, default profile will be used...');
    }
    
    if (configProfileDirectory && fs.existsSync(configProfileDirectory)) {
        
        /*strange nconf rule: 1st load profile will override 2nd load profile, against the common sense :-( */

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
    console.log('Current "profile" variable value is ['+ nconf.get('profile') +']');
}


module.exports = new EnvMgr();

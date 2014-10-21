'use strict';

var paths = {
  js: ['*.js', 'test/**/*.js', '!test/coverage/**', '!bower_components/**', 'packages/**/*.js', '!packages/**/node_modules/**', '!packages/contrib/**/*.js', '!packages/contrib/**/node_modules/**'],
  html: ['packages/**/public/**/views/**', 'packages/**/server/views/**'],
  css: ['!bower_components/**', 'packages/**/public/**/css/*.css', '!packages/contrib/**/public/**/css/*.css']
};

module.exports = function(grunt) {

  if (process.env.NODE_ENV !== 'production') {
    require('time-grunt')(grunt);
  }

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    assets: grunt.file.readJSON('config/assets.json'),
    clean: ['bower_components/build'],
    watch: {
      js: {
        files: paths.js,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      html: {
        files: paths.html,
        options: {
          livereload: true,
          interval: 500
        }
      },
      css: {
        files: paths.css,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: paths.js,
        options: {
          jshintrc: true
        }
      }
    },
    uglify: {
      core: {
        options: {
          mangle: false
        },
        files: '<%= assets.core.js %>'
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      src: paths.css
    },
    cssmin: {
      core: {
        files: '<%= assets.core.css %>'
      }
    },
    env: {
      test: {
        NODE_ENV: 'development'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false // Optionally suppress output to standard out (defaults to false)
        },
        src: ['src/**/test/*-test.js']
      }
    }
  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);
  
  //Default task(s).
  if (process.env.NODE_ENV === 'production') {
    grunt.registerTask('default', ['clean', 'cssmin', 'uglify', 'concurrent']);
  }
  else {
    grunt.registerTask('default', ['clean', 'jshint', 'csslint', 'env:test', 'mochaTest']);
  }


};

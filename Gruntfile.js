module.exports = function (grunt) {
grunt.initConfig({
  
  ts: {
      default : {
        src: ["src/**/*.ts"],
        out: 'dist/artemis.js'
      }
    }
    
});


require('load-grunt-tasks')(grunt);

grunt.registerTask('default', ['ts']);

};
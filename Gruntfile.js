/***/
/*
 * grunt [plugin:tree-prepare] Gruntfile.js
 */

module.exports = function(grunt) {

  grunt.config.set('clean', {
    // After generating new directory, initiate.
    tests: {
      src: ['tmp']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run.
  grunt.registerTask('test', ['tree-prepare', 'clean']);

  // By default.
  grunt.registerTask('default', ['tree-prepare']);

};

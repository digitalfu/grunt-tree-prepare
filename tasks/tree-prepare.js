/***/
var t_name = 'tree-prepare', t_mess = 'Prepare directory trees.';
module.exports = function(grunt) {
  grunt.registerTask(t_name, t_mess, function() {

    try {

      var gtask = this, gopts = gtask.options({
        root: '.',
        clean: false,
        autoDone: true,
      });

      var p = require('path');
      var done = gtask.async(), tree = grunt.config.get(t_name).tree;

      require(p.resolve(__dirname, '..', 'lib/tree-prepare'))(tree, gopts).on(
        'error', onError).on('end', onEnd);

    } catch(e) {
      onError(e);
    }

    function onError(e) {
      grunt.fail.fatal(e);
    }

    function onEnd() {
      var evt = [t_name, 'end'].join('.');
      (gopts.autoDone ? function() {
        grunt.event.emit(evt), done();
      }: function() {
        grunt.event.emit(evt, done);
      })();
    }

  });
};

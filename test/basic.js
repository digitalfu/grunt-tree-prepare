/***/
var path = require('path'), fs = require('fs');
var nodeunit = require('nodeunit'), grun = require('grunt-runner');

// task configuration
var js_conf = {}, options = {
  root: '.',
  autoDone: false
}, tree = {
  'tmp/foo1': 'foo2',
  'tmp/bar1': ['bar2', 'bar3'],
  'tmp/baz1': {
    branch: ['baz2'],
    clean: true
  }
};

js_conf['tree-prepare'] = {
  options: options,
  tree: tree
};

var grunt = require('grunt');
grunt.loadTasks('.'), module.exports = nodeunit.testCase({
  'tree-prepare': function(t) {

    // run the task
    grun(__dirname, js_conf);

    // assertion and go to next task (clean)
    grunt.event.on('tree-prepare.end', function(done) {
      t.ok(true, 'task successfully.'), Object.keys(tree).forEach(function(p) {
        t.ok(fs.statSync(options.root + '/' + p).isDirectory());
      });
      t.done(), done();
    });

  }
});

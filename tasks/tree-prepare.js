/***/
var path = require('path'), fs = require('fs');
var rimraf = require('rimraf'), eventDrive = require('event-drive');
var t_name = 'tree-prepare', t_mess = 'Prepare directory trees.';
module.exports = function(grunt) {

  grunt.registerTask(t_name, t_mess, function() {

    var gtask = this, gopts = gtask.options({
      root: '.',
      clean: false,
      autoDone: true,
    });

    var done = gtask.async(), tree = grunt.config.get(t_name).tree;
    createPath(tree, gopts, path.resolve(gopts.root)).on('error', function(e) {
      grunt.fail.fatal(e);
    }).on('end', function() {
      var evt = [t_name, 'end'].join('.');
      gopts.autoDone ? (function() {
        grunt.event.emit(evt), done();
      })(): (function() {
        grunt.event.emit(evt, done);
      })()
    });

  });

  function createPath(trunk, gopts, parent) {

    var line = [], ee = null;
    Object.keys(trunk).forEach(_caught(function(root) {

      var stat = trunk[root], opts = {};
      var is_object = !(Array.isArray(stat) || typeof stat == 'string');

      opts.tree = [].concat(is_object ? stat.branch: stat);
      is_object && ['clean'].forEach(function(k) {
        opts[k] = k in stat ? stat[k]: gopts[k];
      });

      opts.tree.forEach(function(s) {

        line.push(function() {
          var next = _next(arguments);
          opts.crean ? rimraf(path.join(parent, root, s), next): next();
        });

        line.push(function() {
          var next = _next(arguments);
          recurMkdir(parent, path.join(root, s)).on('error', function(e) {
            ee.emit('error', e);
          }).on('end', next);
        });

      });

    }), ee);

    line.push(function() {
      ee.emit('end');
    })

    return ee = eventDrive(line);

  }

  function recurMkdir(parent, d) {

    var line = [], ee = null;
    var d_arr = d.split('/'), d_dir = '';

    while(d_arr.length)
      (function(t_dir) {
        line.push(function(next) {
          mkdir(path.join(parent, t_dir)).on('error', function(e) {
            ee.emit('error', e);
          }).on('end', next);
        });
      })(d_dir += (d_dir ? '/': '') + d_arr.shift());

    line.push(function() {
      ee.emit('end');
    });

    return ee = eventDrive(line);

  }

  function mkdir(d) {

    var line = [], ee = null;

    line.push(function() {
      try {
        if(!fs.statSync(d).isDirectory())
          throw 'ENOENT';
        ee.emit('end');
      } catch(e) {
        e == 'ENOENT' || e.code == 'ENOENT' ? fs.mkdir(d, function(err) {
          err ? ee.emit('error', err): ee.emit('end');
        }): ee.emit('error', e);
      }
    });

    return ee = eventDrive(line);

  }

}

function _next(a) {
  return Array.prototype.slice.call(a).pop();
}

function _caught(fn, ee) {
  return function() {
    try {
      fn.apply(this, arguments);
    } catch(e) {
      ee.emit('error', e);
    }
  };
}

/***/
var path = require('path'), fs = require('fs');
var rimraf = require('rimraf'), eventDrive = require('event-drive');

module.exports = treePrepare;
treePrepare.recurMkdir = recurMkdir;
treePrepare.mkdir = mkdir;

function treePrepare(trunk, opts) {

  var parent = path.resolve(opts.root);
  var line = [], ee = null;

  Object.keys(trunk).forEach(_caught(function(root) {

    var stat = trunk[root], t_opts = {};
    var is_object = !(Array.isArray(stat) || typeof stat == 'string');

    t_opts.tree = [].concat(is_object ? stat.branch: stat);
    is_object && ['clean'].forEach(function(k) {
      t_opts[k] = k in stat ? stat[k]: opts[k];
    });

    t_opts.tree.forEach(function(s) {

      line.push(function() {
        var next = _next(arguments);
        t_opts.crean ? rimraf(path.join(parent, root, s), next): next();
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

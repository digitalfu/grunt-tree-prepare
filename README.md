# grunt-tree-prepare

Make directory trees.  
Clean option can be provided.

## Install

Install with [npm](http://npmjs.org/):

    npm install grunt-tree-prepare --save-dev
    
## Usage - Use in your Gruntfile.js task with tree object.
```js
module.exports = function(grunt) {
  // make directory tree below:
  // process.cwd()
  //  |- foo  -      <= create if not exist
  //  |       L var  <= create if not exist
  //  L- hoge -      <= create if not exist
  //          L fuga <= cleanup and create
  grunt.config.set('tree-prepare', {
    tree: {
      'foo': ['var'],
      'hoge': { branch: 'fuga', clean: true }
    }
  });
  grunt.loadNpmTasks('grunt-tree-prepare');
  grunt.registerTask(taskname, ['tree-prepare']);
};
```

### Configuration
- options(Object)  
`"clean"(Boolean)` *default: false*  
  Setup clean default for directory.  
  (not truely/falsy)  
`"autoDone"(Boolean)` *default: true*  
  Flag for task end signal auto call.  
  If specified false, "tree-prepare.end" event leads "done" argument
  as an first argument to grunt.event. See *test/basic.js*.
  
- tree(Object)  
`"(Object key)(String)"`  
  Relative path from parent directory. Parent of _tree_ is process.cwd().  
`"branch"(Array|String)"`  
  Create directories with the same status included in the object that belongs.  
`"chmod(Number|String)"` *default: 777  //TODO*  
  Set directory mode. String representation (e.g. "rw-rw-rw-" as 666) can be given.  
`"clean(Boolean)"` *default: false | options.clean*  
  Crean up ( use [rimraf](git://github.com/isaacs/rimraf.git) ) directory contents and itself, create new.  
  

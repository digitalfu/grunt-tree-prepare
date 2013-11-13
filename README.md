# grunt-tree-prepare

Make directory trees.  
Clean option is provided.

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
      'hoge': { fuga: { clean: true }}
    }
  });
  grunt.loadNpmTasks('grunt-contrib-tree-prepare');
  grunt.registerTask(taskname, ['tree-prepare']);
};
```js

### Configuration
- options(Object)  
`"clean"(Boolean)` default: false  
  Setup clean default for directory.  
  (not truely/falsy)  
  
- tree(Object|Array)
  When Array is provided, one of array value a[i] will converts to { a[i]: {} } object.  
`"(Object key)(String)"`  
  Relative path from parent directory. If it's a top object of _tree_, process.cwd() is the parent.  
`"chmod(Number|String)"` default: 777  //TODO  
  Change directory mode. String representation (e.g. "rw-rw-rw-" as 666) can be given.  
`"clean(Boolean)"` default: false | options.clean  
  Crean up (use (rimraf)[git://github.com/isaacs/rimraf.git]) directory contents and itself, create new.  
  

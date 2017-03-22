function Watcher(watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

var fs = require('fs')
    , events = require('events')
    , util = require('util')
    , watchDir = './watch'
    , processedDir = './done';

util.inherits(Watcher, events.EventEmitter);        // util built-in nodejs module
// equivalent to the following code:
/**
 * Watcher.prototype = new events.EventEmitter();
 */

Watcher.prototype.watch = function () {     // extend EventEmitter with method that processes files
    var watcher = this;                     // store reference to watcher object for use in readdir callback
    fs.readdir(this.watchDir, function(err, files) {
        if(err) throw err;
        for(var index in files) {
            watcher.emit('process', files[index]);      // process each file in watch directory
        }
    });
};

Watcher.prototype.start = function() {      // extend EventEmitter with method to start watching
    var watcher = this;
    fs.watchFile(watchDir, function() {
        watcher.watch();
    });
};

var watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function process(file) {
    var watchFile = this.watchDir + '/' + file;
    var processedFile = this.processedDir + '/' + file.toLowerCase();

    fs.rename(watchFile, processedFile, function(err) {
        if(err) throw err;
    });
});

watcher.start();

/**
 * run this script with the following code
 * node file_name.js
 * then create a new Uppercase random file name in watch dir and save it
 * that file will be automatically move to done dir
 */

var events = require('events')
    , util = require('util');

function Watcher(watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

util.inherits(Watcher, events.EventEmitter);        // util built-in nodejs module
// equivalent to the following code:
/**
 * Watcher.prototype = new events.EventEmitter();
 */
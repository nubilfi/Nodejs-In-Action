var fs = require('fs');
var request = request('request');
var htmlparser = require('htmlparser');
var configFilename = './rss_feeds.txt';

function checkForRSSFile() {            // Task 1: make sure file containing the list of RSS feed URLs exists.
    fs.exists(configFilename, function(exists) {
        if(!exists)
            return next(new Error('Missing RSS file: ' + configFilename));  // whenever there is an error, return early
        net(null, configFilename);
    });
}

function readRSSFile(configFilename) {      // Task 2: read and parse file containing the feed URLs
    fs.readFile(configFilename, function(err, feedList) {
        if(err) return next(err);

        feedList = feedList             // convert list of feed URLs to a string and then into an array of feed URLs
                    .toString()
                    .replace(/^\s+|\s+$/g, '')
                    .split("\n");
        var random = Math.floor(Math.random() * feedList.length);       // select random feed URL from array of feed URLs
        next(null, feedList[random]);
    });
}

function downloadRSSFeed(feedUrl) {     // Task 3: do an HTTP request and get data for the selected feed.
    request({ uri: feedUrl }, function(err, res, body) {
        if(err) return next(err);
        if(res.statusCode != 200)
            return next(new Error('Abnormal response status code'));
        next(null, body);
    });
}

function parseRSSFeed(rss) {        // Task 4: parse RSS data into array of items
    var handler = new htmlparser.RssHandler();
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rss);

    if(!handler.dom.items.length)
        return next(new Error('No RSS items found'));
    
    var item = handler.dom.items.shift();
    console.log(item.title);        // display title and URL of the first feed item, if it exists
    console.log(item.link);

    var tasks = [           // add each task to be performed to an array in execution order
        checkForRSSFile,
        readRSSFile,
        downloadRSSFeed,
        parseRSSFeed
    ];

    function next(err, result) {        // a function called next executes each task
        if(err) throw err;      // throw exception if task encounters an error

        var currentTask = tasks.shift();    // next task comes from array of tasks

        if(currentTask) {
            currentTask(result);        // execute current task
        }
    }

    next();      // start serial execution of tasks
}
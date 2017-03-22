var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';

function checkIfComplete() {
    completedTasks++;
    if(completedTasks == tasks.length) {
        for(var index in wordCounts) {      // when all tasks have completed, list each word used in the files and how many times it was used
            console.log(index + ': ' + wordCounts[index]);
        }
    }
}

function countWordsInText(text) {
    var words = text
                .toString()
                .toLowerCase()
                .split(/\W+/)
                .sort();
    for(var index in words) {       // count word occures in text
        var word = words[index];
        if(word) {
            wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
        }
    }
}

fs.readdir(filesDir, function(err, files) {
    if(err) throw err;
    for(var index in files) {
        var task = (function(file) {    // define a task to handle each file. Eah task includes a call to a function that will asychronously read the file and then count the file's word usage
            return function() {
                fs.readFile(file, function(err, text) {
                    if(err) throw err;
                    countWordsInText(text);
                    checkIfComplete();
                });
            };
        })(filesDir + '/' + files[index]);
        tasks.push(task);       // add each task to an array of functions to call in parallel
    }
    for(var task in tasks) {    // start executing every task in parallel
        tasks[task]();
    }
});

/**
 * File-based data storage
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.splice(2);        // splice out "node cli_tasks.js" to elave arguments
const command = args.shift();               // pull out first argument (the command)
const taskDescription = args.join(' ');
const file = path.join(process.cwd(), '/.tasks');   // resolve database path relative to current working directory

switch (command) {
    case 'list':                            // 'list' will list all tasks stored
        listTasks(file);
        break;
    case 'add':                             // 'add' will add new task
        addTask(file, taskDescription);
        break;
    default:                                // anything else will show usage help
        console.log('Usage: ' + process.argv[0] + ' list|add [taskDescription]');
}

function loadOrInitializeTaskArray(file, cb) {
    fs.exists(file, (exists) => {           // check if .tasks file already exists
        // let tasks = [];
        if (exists) {
            fs.readFile(file, 'utf8', (err, data) => {   // read to-do data from .tasks file
                if (err) throw err;
                let newdata = data.toString();
                let tasks = JSON.parse(newdata || '[]');   // parse JSON-encoded to-do data into array of tasks
                cb(tasks);
            });
        } else {
            cb([]);                         // create empty array of tasks if tasks file doesn't exist
        }
    });
}

function listTasks(file) {
    loadOrInitializeTaskArray(file, (tasks) => {
        for(var i in tasks) {
            console.log(tasks[i]);
        }
    });
}

function storeTasks(file, tasks) {
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', (err) => {
        if(err) throw err;
        console.log('Saved.');
    });
}

function addTask(file, taskDescription) {
    loadOrInitializeTaskArray(file, (tasks) => {
        tasks.push(taskDescription);
        storeTasks(file, tasks);
    });
}

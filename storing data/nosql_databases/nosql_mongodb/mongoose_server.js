/**
 * Mongoose node example
 * install: npm install --save mongoose
 */

// open and closing a connection
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost/games');

mongoose.disconnect();

// registering a schema
const Schema = mongoose.Schema;
const Tasks = new Schema(
    genre: String,
    title: String
);
mongoose.model('Tasks', Tasks);

// adding a Task
const Task = mongoose.model('Tasks');
const task = new Task();
task.genre = 'Strategy';
task.title = 'Zuma';
task.save((err) => {
    if (err) throw err;
    console.log('Task saved.');
});

// searching for a document
const Task = mongoose.model('Task');
Task.find({ 'genre': 'Strategy' }, (err, tasks) => {
    for (var i = 0; i < tasks.length; i++) {
        console.log('ID: ' + tasks[i]._id);
        console.log(tasks[i].title);
    }
});

// updating a document
const Task = mongoose.model('Task');
Task.update(
    { _id: '58d3d5b6a6488dd1d67b95a5' },        // update using internal ID
    { title: 'MotoGP' },
    { multi: false },                           // only update one document
    (err, rows_updated) => {
        if (err) throw;
        console.log('Updated.');
    }
);

// removing a document
const Task = mongoose.model('Tasks');
Task.findById('58d3d5b6a6488dd1d67b95a5', (err, task) => {
    task.remove();
});

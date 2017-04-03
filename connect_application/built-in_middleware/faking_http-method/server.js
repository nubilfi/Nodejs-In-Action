'use strict';
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

function edit(req, res, next) {
    if ('GET' !== req.method) return next();
    res.setHeader('Content-Type', 'text/html');
    res.write('<form method="post">');
    res.write('<form method="post">');
    res.write('<input type="hidden" name="_method" value="put" />');
    res.write('<input type="text" name="username" value="Tobi" />');
    res.write('<input type="submit" value="Update" />');
    res.write('</form>');
    res.end();
}

function update(req, res, next) {
    if ('PUT' !== req.method) return next();
    console.log('altered method is : ' + req.method);        // check the altered method
    console.log('original method is : ' + req.originalMethod); // check the original method
    res.send('Updated name to ' + req.body.username);
}

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use('/', edit, update, function (req, res, next) {
    // middleware takes this place
});

app.listen(3000);

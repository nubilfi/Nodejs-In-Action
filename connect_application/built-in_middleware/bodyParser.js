/**
 * Basic bodyParser(): parsing request bodies
 * run with this command (parsing JSON data):
 * $ curl -d '{"username":"tobi"}' -H "Content-Type: application/json" http://localhost:3000
 * $ curl -F image=@photo.png -F name=tobi http://localhost:3000
 */
const connect = require('connect');
const bodyParser = require('body-parser');
const app = connect()
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use((req, res) => {
        'use strict';
        // res.setHeader('Set-Cookie', 'foo=bar');
        // res.setHeader('Set-Cookie', 'tobi=ferret; Expires=Tue, 27 March 2018 10:12:11 GMT');
        res.end('Registered new user: ' + req.body.username + '\n');
    }).listen(3000);

const connect = require('connect');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = connect()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(cookieParser())
    .use(session({
        secret: 'abcd1234',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge : 3600000 * 24 }
    }))
    .use(function (req, res, next) {
        'use strict';

        let sess = req.session;
        if (sess.views) {
            sess.views++;
            res.setHeader('Content-Type', 'text/html');
            res.write('<p>views: ' + sess.views + '</p>');
            res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
            res.write('<p>httpOnly: ' + sess.cookie.httpOnly + '</p>');
            res.write('<p>path: ' + sess.cookie.path + '</p>');
            res.end();
        } else {
            sess.views = 1;
            res.end('welcome to the session demo. please reload page!\n');
        }
    });

app.listen(3000);



// The following snippet is for express app
// #############################################
//
// const express = require('express');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const session = require('express-session');
//
// const app = express();
//
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }))
// const sessionData = {
//     secret: 'abcd1234',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {}
// }
//
// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1); // trust first proxy
//   sessionData.cookie.secure = true; // serve secure cookies
//   sessionData.cookie.maxAge = 3600000 * 24;  // expire in 24 hours
// }
// app.use(cookieParser());
// app.use(session(sessionData));
//
// // Access the session as req.session
// app.get('/', function(req, res, next) {
//     let sess = req.session;
//     if (sess.views) {
//         sess.views++;
//         res.setHeader('Content-Type', 'text/html');
//         res.write('<p>views: ' + sess.views + '</p>');
//         res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
            // res.write('<p>domain: ' + sess.cookie.domain + '</p>');
            // res.write('<p>secure: ' + sess.cookie.secure + '</p>');
//         res.end();
//     } else {
//         sess.views = 1;
//         res.end('welcome to the session demo. please reload page!\n');
//     }
// });
//
// app.listen(3000);

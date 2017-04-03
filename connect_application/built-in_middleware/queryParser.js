const connect = require('connect');
const url = require('url');

const app = connect()
    .use(function (req, res, next) {
        'use strict';
        let queryData = url.parse(req.url, true).query;
        res.setHeader('Content-Type', 'application/json');
        console.log(queryData);
        res.end(JSON.stringify(queryData));
    });
app.listen(3000);

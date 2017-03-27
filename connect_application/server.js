/**
 * Setting up a connect application and
 * how connect middleware works
 */

const connect = require('connect');
const app = connect();

function logger(req, res, next) {       // prints HTTP method and request URL and calls next()
    'use strict';

    console.log('%s %s', req.method, req.url);
    next();
}

function hello(req, res) {              // Ends response to HTTP request with 'hello world'
    'use strict';

    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world\n');
}

app.use(logger);
app.use(hello);
app.listen(3000);

/* Other version */
// connect()
//     .use(logger)
//     .use(hello)
//     .listen(3000);

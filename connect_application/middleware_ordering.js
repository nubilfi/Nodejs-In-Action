/**
 * why middleware ordering matters
 */

const connect = require('connect');
const app = connect();

function logger(req, res, next) {       // always calls next(), so subsequent middleware is invoked
    'use strict';
    
    console.log('%s %s', req.method, req.url);
    next();
}

function hello(req, res) {              // doesn't call next(), because component responds to request
    'use strict';

    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world\n');
}

app.use(hello);     // logger will never be invoked because hello doesn't call next()
app.use(logger);
app.listen(3000);

// using middleware order to perform authentication
connect()
    .use(logger)
    .use(restrictFileAccess)        // next() will only be called if user is valid
    .use(serveStaticFiles)
    .use(hello);

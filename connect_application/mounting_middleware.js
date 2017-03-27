const connect = require('connect');

function logger(req, res, next) {       // always calls next(), so subsequent middleware is invoked
    'use strict';

    console.log('%s %s', req.method, req.url);
    next();
}

function authenticateWithDatabase(user, pass, cb) {
    'use strict';

    let err;
    if (user !== 'tobi' || pass !== 'ferret') {
        err = new Error('Unauthorized');
    }
    cb(err);
}

function restrict(req, res, next) {
    'use strict';

    let authorization = req.headers.authorization;
    if (!authorization) return next(new Error('Unauthorized'));

    let parts = authorization.split(' ');
    let scheme = parts[0];
    let auth = new Buffer(parts[1], 'base64').toString().split(':');
    let user = auth[0];
    let pass = auth[1];

    authenticateWithDatabase(user, pass, function (err) {       // A function that checks credentials against a database
        if (err) return next(err);          // informs dispatcher that an error occurred

        next();         // calls next() with no arguments when given valid credentials
    });
}

function admin(req, res, next) {
    'use strict';

    switch (req.url) {
        case '/':
            res.end('try /users');
            break;
        case '/users':
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(['tobi', 'loki', 'jane']) + '\n');
            break;
        default:

    }
}

function hello(req, res, next) {
    'use strict';

    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world\n');
    next();
}

// mounting a middleware component
connect()
    .use(logger)
    .use('/admin', restrict)        // when a string is the first argument to .use(), Connect will
    .use('/admin', admin)           // only invoke the middleware when the prefix URL matches.
    .use(hello)
    .listen(3000);

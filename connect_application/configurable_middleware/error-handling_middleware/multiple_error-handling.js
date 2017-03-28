const connect = require('connect');

function hello(req, res, next) {
    'use strict';
    if (req.url.match(/^\/hello/)) {    // match '/hello' with regexp
        res.end('Hello World\n');
    } else {
        next();
    }
}

const db = {
    users: [
        { name: 'tobi' },
        { name: 'loki' },
        { name: 'jane' }
    ]
};

function users(req, res, next) {            // The users component will throw a notFoundError when a user doesn’t exist.
    'use strict';
    let match = req.url.match(/^\/user\/(.+)/);            // match the req.url using regexp
    console.log(db.users);
    console.log(db.users[match[1]]);
    if (match) {                            // check if the user index exists by using match[1]
        let user = db.users[match[1]];      // which is the first capture group
        if (user) {                         // if the user exists, it's serialized as JSON
            req.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
        } else {                            // otherwise an error is passed to the next() function
            let err = new Error('User not found');      // with its notFound property set to true
            err.notFound = true;
            next(err);
        }
    } else {
        next();
    }
}

function pets(req, res, next) {     //The pets component will cause a ReferenceError to be thrown to demonstrate the error handler.
    'use strict';
    if (req.url.match(/^\/pet\/(.+)/)) {
        foo();      // trigger an exception by called undefined foo() function
    } else {
        next();
    }
}

function errorHandler(err, req, res, next) {        // The errorHandler component will handle any errors from the api app.
    'use strict';
    // an error-handling that doesn't expose unecessary data
    console.error(err.stack);
    res.setHeader('Content-Type', 'application/json');
    if (err.notFound) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: err.message }));
    } else {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
}

const api = connect()
    .use(users)
    .use(pets)
    .use(errorHandler);

const app = connect()
    .use(hello)
    .use('/api', api)
    // .use(errorPage)
    .listen(3000);

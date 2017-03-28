const connect = require('connect');

function errorMiddleware(req, res, next) {
    'use strict';
    next(new Error('Trigger an error\n'));
}

function errorHandler() {
    'use strict';

    let env = process.env.NODE_ENV || 'development';
    return function (err, req, res, next) {             // error-handling middleware defines four arguments
        res.statusCode = 500;
        switch (env) {                  // errorHandler middleware component behaves differently depending on value of NODE_ENV
            case 'development':
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(err));
                break;
            default:
                res.end('Server error');
        }
    };
}

connect()
    // .use(function hello (req, res) {
    //     foo();
    //     res.setHeader('Content-Type', 'text/plain');
    //     res.end('hello world\n');
    // })
    .use(errorMiddleware)
    .use(errorHandler)
    .listen(3000);

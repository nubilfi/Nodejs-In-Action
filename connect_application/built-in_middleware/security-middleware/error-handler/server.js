const connect = require('connect');
const logger = require('morgan');
const errorHandler = require('errorhandler');

const app = connect()
    .use(logger('dev'))
    .use(function (req, res, next) {
        setTimeout(function () {
            next(new Error('something broke!'));
        });
    }, 500)
    .use(errorHandler());

app.listen(3000);

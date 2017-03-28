const connect = require('connect');
const router = require('./middleware/router');
const routes = {                            // routes are stored as an object
    GET: {
        '/users': function (req, res) {
            res.end('tobi, loki, ferret\n');
        },
        '/user/:id': function (req, res, id) {      // each entry maps to request URL and contains callback function to be invoked
            res.end('user ' + id + '\n');
        }
    },
    DELETE: {
        '/user/:id': function (req, res, id) {
            res.end('deleted user ' + id + '\n');
        }
    }
};

connect()
    .use(router(routes))                    // pass routes object to router setup function
    .listen(3000);

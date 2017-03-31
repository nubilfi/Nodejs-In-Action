const connect = require('connect');
const bodyParser = require('body-parser');

/* function for type of body */
// function type(type, fn) {   // fn in this case is a limit() instance
//     'use strict';
//     return function (req, res, next) {
//         let ct = req.headers['content-type'] || '';
//         if (0 !== ct.indexOf(type)) {       // returned middleware first checks content-type
//             return next();
//         }
//         fn(req, res, next);         // middleware then invokes passed-in limit() component
//     };
// }

// The body-parser module only handles JSON and urlencoded form submissions, not multipart
// (which would be the case if you're uploading files).
const app = connect()
    .use(bodyParser.urlencoded({ limit: '64kb', extended: false }))
    .use(bodyParser.json({ limit: '32kb' }));
    // third-party package to handle/limit image/video uploads
app.listen(3000);

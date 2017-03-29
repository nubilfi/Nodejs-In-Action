/**
 * run with this command:
 * $ curl http://localhost:3000/ -H "Cookie: foo=bar, bar=baz"  // regular cookies
 * $ curl http://localhost:3000/ -H "Cookie: name=jane.PQLM0wNvqOQEObZXUkWbS5m6Wlg"     // signed cookies
 * $ curl http://localhost:3000/ -H 'Cookie: foo=bar, bar=j:{"foo":"bar"}'      // regular JSON cookies (for good interface)
 * $ curl http://localhost:3000/ -H "Cookie: cart=j:{\"items\":[1]}.sD5p6xFFBO/4ketA1OP43bcjS3Y"      // signed cookies JSON cookies (for good interface)
*/
const connect = require('connect');
const cookieParser = require('cookie-parser');
const app = connect()
    //.use(connect.cookieParser('tobi is a coo ferret'))  // <== Since version 2.21.0 (2014-06-20) of Connect they deprecated cookie-parser integration
    .use(cookieParser('tobi is a coo ferret'))
    .use((req, res) => {
        'use strict';
        console.log(req.cookies);       // cookies properties get set to objects representing the parsed Cookie header that was sent with the request
        console.log(req.signedCookies); // signedCookies properties get set to objects representing the parsed Cookie header that was sent with the request
        res.end('hello\n');
    }).listen(3000);


/* Outgoing Cookies example
* run with this command:
* $ curl http://localhost:3000/ --head
*/
const connect = require('connect');
const cookieParser = require('cookie-parser');
const app = connect()
    .use((req, res) => {
        'use strict';
        res.setHeader('Set-Cookie', 'foo=bar');
        res.setHeader('Set-Cookie', 'tobi=ferret; Expires=Tue, 27 March 2018 10:12:11 GMT');
        res.end();
    }).listen(3000);

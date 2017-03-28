const parse = require('url').parse;
module.exports = function route(obj) {
    'use strict';

    return function (req, res, next) {
        if (!obj[req.method]) {                             // check to make sure req.method is defined
            next();
            return;                     // if not, invoke next() and stop any further execution
        }
        let routes = obj[req.method];                       // lookup paths for req.method
        let url = parse(req.url);                           // URL for matching against pathname
        let paths = Object.keys(routes);                    // store paths for req.method as array

        for (var i = 0; i < paths.length; i++) {            // loop through paths
            let path = paths[i];
            let fn = routes[path];
            path = path
                    .replace(/\//g, '\\/')
                    .replace(/:(\w+)/g, '([^\\/]+)');
            let re = new RegExp('^' + path + '$');          // construct regular expression
            let captures = url.pathname.match(re);
            if (captures) {             // attempt match against pathname
                let args = [req, res].concat(captures.slice(1));        // pass the capture groups
                fn.apply(null, args);
                return;                 // return when match is found to prevent following next() call
            }
        }
        next();
    };
};

/**
 * [setup An example of a configurable middleware]
 * @param  {[string]} format [accept single argument named 'format']
 * @return [function]          [retain access to the format variable,
                                even after the setup function has returned, because it’s defined within the same
                                JavaScript closure]
 */
function setup(format) {        // setup function cab be called multiple times with different configurations
    'use strict';

    let regexp = /:(\w+)/g;     // logger component uses a regexp to match request properties

    return function logger(req, res, next) {    // actual logger component that Connect will use
        let str = format.replace(regexp, function (match, property) {       // use regexp to format log entry for request
            return req[property];
        });
        console.log(str);       // print request log entry to console

        next();                 // pass control to next middleware component
    }
}

module.exports = setup;         // directly export logger setup function

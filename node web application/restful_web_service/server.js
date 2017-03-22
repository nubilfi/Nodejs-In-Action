/**
 * To-do List REST web service
 */

const http = require('http');
const url = require('url');
const items = [];                       // the data store is a regular JS array in memory.

const server = http.createServer(function (req, res) {
    switch (req.method) {               // req.method is the HTTP methode requested
        case 'POST':
            let item = '';              // set up string buffer fo the incoming item

            req.setEncoding('utf8');            // a chunk is now a utf8 string instead of a buffer
            req.on('data', (chunk) => {         // data events are fired whenever a new chunk (default Buffer object) of data has been read.
                console.log('parsed', chunk);   // a chunk, by default, is a Buffer object(a byte array).
                item += chunk;                  // concatenate data chunk onto the buffer
            });
            req.on('end', () => {               // the end event is fired when everything has been read.
                console.log('done parsing');
                items.push(item);               // push complete new item onto the items array
                res.end('OK\n');
            });
            console.log(items);
            break;
        case 'GET':
            /*items.forEach((item, i) => {
                res.write(i + ') ' + item + '\n'); */     // write the header with the default field
            /*});*/                                         // run server.js and type POST item using curl -d 'blablba' http://localhost:3000'

            /* Optimized version of GET */
            let body = items.map((item, i) => {
                return i + ') ' + item;
            }).join('\n');
            res.setHeader('Content-Length', Buffer.byteLength(body));       // Content-Length val shoul represent the by length not char length(body.length)
            res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
            res.end(body);
            console.log(items);
            break;
        case 'PUT':
            let param = url.parse(req.url).pathname;                     // pathname would be PUT url:3000/item_index
            let id = parseInt(param.slice(1), 10);
            let temp = '';

            req.setEncoding('utf8');
            req.on('data', (chunk) => {
                console.log('new data parsed: ', chunk);
                temp += chunk;
            });
            req.on('end', () => {
                if (isNaN(id)) {             // check that number is valid
                    res.setStatusCode = 400;
                    res.end('Invalid item id\n');
                } else if (!items[id]) {
                    res.setStatusCode = 404;
                    res.end('item not found\n');
                } else {
                    console.log('done parsing new data');
                    items.map((item, i) => {
                        if (id === i) {             // if items array index equals to PUT parameter (path/id) change founded array index to new array
                             items[i] = temp;
                        }
                    });
                }
                res.end('OK\n');
            });
            break;
        case 'DELETE':
            let path = url.parse(req.url).pathname;                     // pathname would be DELETE url:3000/item_index
            let i = parseInt(path.slice(1), 10);

            if (isNaN(i)) {             // check that number is valid
                res.setStatusCode = 400;
                res.end('Invalid item id\n');
            } else if(!items[i]) {      // ensure requested index exists
                res.setStatusCode = 404;
                res.end('item not found\n');
            } else {
                items.splice(i, 1);         // delete requested item
                res.end('OK\n');
            }
            break;
        default:
    }
});
server.listen(3000);

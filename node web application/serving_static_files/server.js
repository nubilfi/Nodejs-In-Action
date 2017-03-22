/**
 * Static file server
 */

 const http  = require('http')
    ,  parse = require('url').parse
    ,  join  = require('path').join
    ,  fs    = require('fs');

const root = __dirname;     // define magic variable for root

const server = http.createServer(function (req, res) {
    let url = parse(req.url);                   // parse the url to get the pathname, ex: /index.html
    let path = join(root, url.pathname);        // join the pathname to root file dir, ex: /var/www/index.html

    fs.stat(path, function (err, stat) {              // check for file's existence
        if (err) {
            if ('ENOENT' == err.code) {         // file doesn't exist
                res.statusCode = 404;
                res.end('File not found\n');
            } else {                            // some other error
                res.statusCode = 500;
                res.end('Internal server error\n');
            }
        } else {
            res.setHeader('Content-Length', stat.size); // set Content-Length using stat object
            let stream = fs.createReadStream(path);     // create fs.ReadStream (high-level streaming disk access)

            // stream.on('data', (chunk) => {              // write file data to response
            //     res.write(chunk);
            // }));
            // stream.on('end', () => {
            //     res.end();                              // end response when file is complete
            // });

            /* Optimized version */
            stream.pipe(res);                           // res.end() called internally by stream.pipe()
            stream.on('error', (err) => {               // handling server error with 'error' event handler
                res.statusCode = 500;
                res.end('Internal server error\n');
            });
        }
    });
});
server.listen(3000);

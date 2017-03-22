const https = require('https');
const fs = require('fs');

// generate private key
// $ openssl genrsa 2048 > key.pem
//
// generate certificate
// $ openssl req -x509 -new -key key.pem > key-cert.pem
const options = {
    key: fs.readFileSync('./keys/key.pem'),         // SSL key and cert given as options
    cert: fs.readFileSync('./keys/key-cert.pem')
};

https.createServer(options, function (req, res) {         // options object is passed in first
    res.writeHead(200);                             // https and http modules have almost identical APIs
    res.end("hello world\n");
}).listen(3000);

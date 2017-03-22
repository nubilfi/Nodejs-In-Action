const http = require('http');
const formidable = require('formidable');

const server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'GET':
            show(req, res);
            break;
        case 'POST':
            upload(req,res);
            break;
        default:
    }
});

function show(req, res) {              // serve HTML form with file input
    let html = '' +
                '<form method="post" action="/" enctype="multipart/form-data">' +
                '<p><input type="text" name="name" /></p>' +
                '<p><input type="file" name="file" /></p>' +
                '<p><input type="submit" value="Upload" /></p>' +
                '</form>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
}

function upload(req, res) {
    if (!isFormData(req)) {            // check the request if doesn't appear to contain the appropriate type of content
        res.statusCode = 400;
        res.end('Bad request: exptecting multipart/form-data');
        return;
    }

    let form = new formidable.IncomingForm();   // IncomingForm() emit many events itself and it streams file uploads to the /tmp dir

    // form.on('field', (field, value) => {    // compeleted receipt of a field
    //     console.log(field);
    //     console.log(value);
    // });
    //
    // form.on('file', (name, file) => {       // when a file has been received and processed
    //     console.log(name);
    //     console.log(file);
    // });
    //
    // form.on('end', () => {
    //     res.end('upload complete!');
    // });
    form.on('progress', (bytesReceived, bytesExpected) => {             // calculating upload progress
        let percent = Math.floor(bytesReceived / bytesExpected * 100);
        console.log(percent);
    });

    /* Optimized version */
    form.parse(req, (err, fields, files) => {
        console.log(fields);
        console.log(files);
        res.end('upload complete');
    });
}

function isFormData(req) {
    let type = req.headers['content-type'] || '';       // check the content-type header field for multipart/form-data
    return 0 === type.indexOf('multipart/form-data');   // by using string.indexOf() method to assert that multipart/form-data is at the beginning of the field's value
}
server.listen(3000);

const connect = require('connect');
const serveStatic = require('serve-static');
const compress = require('compression');

const app = connect()
    .use(compress())
    .use(serveStatic('public', { index: 'foo.js' } ));

app.listen(3000);

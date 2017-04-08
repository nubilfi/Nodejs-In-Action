const connect = require('connect');
const serveStatic = require('serve-static');
const serveIndex = require('serve-index');

const app = connect()
    .use(serveIndex('public'))
    .use(serveStatic('public', { index: 'foo.js' } ));

app.listen(3000);

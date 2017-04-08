const connect = require('connect');
const basicAuth = require('basic-auth-connect');

const app = connect()
    .use(basicAuth('tobi', 'ferret'))
    .use(function (req, res) {
        res.end("I'm a secret\n");
    })

app.listen(3000);

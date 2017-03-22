const http = require('http');
const work = require('./lib/timetrack');
const mysql = require('mysql');

const db = mysql.createConnection({     // connect to MySQL
    host: 'localhost',
    user: 'root',
    password: 'curious',
    database: 'timetrack'
});

const server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'POST':                    // Route HTTP POST requests
            switch (req.url) {
                case '/':
                    work.add(db, req, res);
                    break;
                case '/archive':
                    work.archive(db, req, res);
                    break;
                case '/delete':
                    work.delete(db, req, res);
                    break;
                default:
            }
            break;
        case 'GET':                     // Route HTTP GET requests
            switch (req.url) {
                case '/':
                    work.show(db, res);
                    break;
                case '/archived':
                    work.showArchived(db, res);
                    break;
                default:
            }
            break;
        default:

    }
});

db.query(
    "CREATE TABLE IF NOT EXISTS work (" +       // Table creation SQL
    "id INT(10) NOT NULL AUTO_INCREMENT, " +
    "hours DECIMAL(5,2) DEFAULT 0, " +
    "date DATE, " +
    "archived INT(1) DEFAULT 0, " +
    "description LONGTEXT, " +
    "PRIMARY KEY(id))",
    (err) => {
        if (err) throw err;
        console.log('Server started...');
        server.listen(3000, '127.0.0.1');       // start HTTP Server
    }
);

/**
 * Helper functions:
 * Sending HTML, creating forms, receiving form data
 */
const qs = require('querystring');

exports.sendHtml = function (res, html) {       // send HTML response
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
};

exports.parseReceivedData = function (req, cb) {    // parse HTTP POST data
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => body += chunk);
    req.on('end', () => {
        let data = qs.parse(body);
        cb(data);
    });
};

exports.actionForm = function (id, path, label) {   // render simple form
    let html = '<form method="POST" action="' + path + '">' +
        '<input type="hidden" name="id" values="' + id + '">' +
        '<input type="submit" value="' + label + '"/>' +
        '</form>';
    return html;
};

exports.add = function (db, req, res) {             // Adding record
    exports.parseReceivedData(req, (work) => {      // parse HTTP POST data
        db.query(
            "INSERT INTO work (hours, date, description) " +     // SQL to add work record
            "VALUES (?, ?, ?) ",
            [work.hours, work.date, work.description],          // work record data
            (err) => {
                if (err) throw err;
                exports.show(db, res);              // show user a list of work records
            }
        );
    });
};

exports.delete = function (db, req, res) {          // Deleting record
    exports.parseReceivedData(req, (work) => {      // parse HTTP POST data
        db.query(
            "DELETE FROM work WHERE id=?",          // SQL to delete work record
            [work.id],                              // work record ID
            (err) => {
                if (err) throw err;
                exports.show(db, res);              // show user a list of work records
            }
        );
    });
};

exports.archive = function (db, req, res) {         // Updating record
    exports.parseReceivedData(req, (work) => {      // parse HTTP POST data
        db.query(
            "UPDATE work SET archived=1 WHERE id=?",    // SQL to update work record
            [work.id],                              // work record ID
            (err) => {
                if (err) throw err;
                exports.show(db, res);              // show user a lists of work records
            }
        );
    });
};

exports.show = function (db, res, showArchived) {   // Retrieving work records
    let query = "SELECT * FROM work " +
        "WHERE archived=? " +
        "ORDER BY date DESC";

    let archiveValue = (showArchived) ? 1 : 0;
    db.query(
        query,
        [archiveValue],                             // Desired work-record archive status
        (err, rows) => {
            if (err) throw err;
            let html = '';
            html = (showArchived) ? '' : '<a href="/archived">Archived Work</a><br/>';
            html += exports.workHitlistHtml(rows);  // format resuls as HTML
            html += exports.workFormHtml();
            exports.sendHtml(res, html);            // send HTML response to user
        }
    );
};

exports.showArchived = function (db, res) {
    exports.show(db, res, true);                    // show only archived work records
};

exports.workHitlistHtml = function (rows) {         // rendering work records to an HTML table
    let html = '<table>';
    for(var i in rows) {                            // render each work record as HTML table row
        html += '<tr>';
        html += '<td>' + rows[i].date + '</td>';
        html += '<td>' + rows[i].hours + '</td>';
        html += '<td>' + rows[i].description + '</td>';
        if (!rows[i].archived) {                    // show archive button if work record isn't already archived
            html += '<td>' + exports.workArchiveForm(rows[i].id) + '</td>';
        }
        html += '<td>' + exports.workDeleteFrom(rows[i].id) + '</td>';
        html += '</tr>';
    }
    html += '</table>';
    return html;
};

exports.workFormHtml = function () {                // render blank HTML form fro entering new work record
    let html = '<form method="POST" action="/">' +
        '<p>Date (YYYY-MM-DD): <br/><input type="text" name="date"></p>' +
        '<p>Hours worked: <br/><input type="text" name="hours"></p>' +
        '<p>Description:<br/>' +
        '<textarea name="description"></textarea></p>' +
        '<input type="submit" value="Add">' +
        '</form>';
    return html;
};

exports.workArchiveForm = function (id) {           // render archive button form
    return exports.actionForm(id, '/archive', 'Archive');
};

exports.workDeleteFrom = function (id) {            // render delete button form
    return exports.actionForm(id, '/delete', 'Delete');
};

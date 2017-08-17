const http = require('http');
const port = process.env.PORT || 3000;

function handle_GET_req(res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('Get action was requested');
}

function handle_POST_req(res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('Post action was requested');
}

function handle_PUT_req(res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('Put action was requested');
}

function handle_HEAD_req(res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('Head action was requested');
}

function handle_DELETE_req(res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('Delete action was requested');
}

function handle_bad_req(res) {
  res.writeHead(400, {
    'Content-Type': 'text/plain'
  });
  res.end('Bad request');
}

function handle_request(req, res) {
  switch (req.method) {
    case 'GET':
      handle_GET_req(res);
      break;
    case 'POST':
      handle_POST_req(res);
      break;
    case 'PUT':
      handle_PUT_req(res);
      break;
    case 'DELETE':
      handle_DELETE_req(res);
      break;
    case 'HEAD':
      handle_HEAD_req(res);
      break;
    default:
      handle_bad_req(res);
      break;
  }
  console.log('Request processing ended');
}

http.createServer(handle_request).listen(port, 'localhost');

console.log(`Server is running at localhost:${port}`);
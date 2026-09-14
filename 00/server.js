let http = require('http');

let server = http.createServer((req, res) => {

  if (req.url === '/home') {
    res.end('This is the HOME page');
  }

  if (req.url === '/about') {
    res.end('This is the ABOUT page');
  }

  if (req.url === '/users') {
    res.end('This is the USERS page');
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
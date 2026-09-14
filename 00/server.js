let http = require('http');

let server = http.createServer((req, res) => {
  res.end("Hello Client, I am a Server");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
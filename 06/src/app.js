const express = require('express');
const fileRoutes = require('./routes/file.route');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/file', fileRoutes);

module.exports = app;
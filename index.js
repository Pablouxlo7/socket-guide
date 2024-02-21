const WebSocketServer = require('./services/webSocketServer');
const express = require('express');
const http = require('http');
const {resolve} = require("path");

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);


let guideCounter = 0;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const publicPath = resolve(__dirname, 'public');

app.use(express.static(publicPath));

const ws = new WebSocketServer(server);
ws.setup();

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

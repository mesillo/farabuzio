"use strict";

const fs = require('fs');
const https = require('https');
const http = require('http');
const WebSocket = require('ws');
 
//const server = https.createServer({
//  cert: fs.readFileSync('/path/to/cert.pem'),
//  key: fs.readFileSync('/path/to/key.pem')
//});

const server = http.createServer();

const wss = new WebSocket.Server({ server });
 
wss.on('connection', function connection(ws) {
    console.log( "=== connection ===" );
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send("PONG");
  });
});
 
server.listen(8080);
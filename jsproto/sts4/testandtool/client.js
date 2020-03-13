"use strict";

const WebSocket = require('ws');
 
//const ws = new WebSocket('wss://echo.websocket.org/', {
//  origin: 'https://websocket.org'
//});

const ws = new WebSocket('wss://localhost:8080', { rejectUnauthorized: false } );

ws.on('open', function open() {
  console.log('connected');
  ws.send( "PING" );
});
 
ws.on('close', function close() {
  console.log('disconnected');
});
 
ws.on('message', function incoming(data) {
  console.log( data );
 
  setTimeout(function timeout() {
    ws.send("PING");
  }, 500);
});
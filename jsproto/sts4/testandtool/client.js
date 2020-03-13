"use strict";

const WebSocket = require('ws');
 
//const ws = new WebSocket('wss://echo.websocket.org/', {
//  origin: 'https://websocket.org'
//});

const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1ODQwMTI3NjQsImV4cCI6MTU4NDA5OTE2NCwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGE2ODYzMzY2YzUuZXUuZm0tY2xvdWQuY29tIiwiYXVkIjpbImh0dHBzOi8vdG9rZW4uc3RzdjQuNTBhNjg2MzM2NmM1LmV1LmZtLWNsb3VkLmNvbS9yZXNvdXJjZXMiLCJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImNsaWVudF9pZCI6Im1hc3RlciIsInN1YiI6IjkxMzI2N2I4LTU0MDUtNDk4ZC03NjE4LTA4ZDc2OWJiMWY4ZiIsImF1dGhfdGltZSI6MTU4NDAxMjc2NCwiaWRwIjoibG9jYWwiLCJyZXZlYWxfYWNjb3VudF9pZCI6IjEwMTUxMjciLCJyZXZlYWxfdXNlcl9pZCI6IjE1OTgwMjgiLCJyZXZlYWxfdXNlcl90eXBlX2lkIjoiMiIsInVuaXF1ZV9uYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx1Y2FzQFRFdGVzdC5jb20iLCJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwianRpIjoiNDA2NDdmYTcxZjI5YzU0MGEzMGI5OWFmZDFjMTAyZDkiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImFtciI6WyJwd2QiXX0.SZcgL7Jhnm5oTK3W55R5AOvmitgFYJp14c0Fp8yW8NWFvo9VtY-6u_idFX1XkkrYVGnJr4gWPLWCVwlZQlisYQwbNqY2r_GqVsxLwX_11AKEd4ukj17oGmg0mzT6rhOZCpaUUkgOC6AOaeLDbc4Mqh_O8QoPQDzZ7-Xll8dPh497LNtJHNNsCyD8XztcTnTTS_M3_jlCHnryVqnW7f7tKy59zgtvyKnJcoHcvznREvYXdWX0GbH8wFWpXfz_LGWp52kvnjFRevmsmzPnDHvJ84fZoatuXMromDd6q-tjf8aCp50rWTJSovSDqsnECWczOdW8jo2j1BiBC0Ou5Pal6QzQQla2ZHZnsnaJojDkaUbHkwdhJi0HMqhNce4LGbq_4cGSOVMYrgF5rY-QbtsDdpTGTHkBs6dkgFF48e-hyFiU4265OZqslvcK6S1qudrN2eS0-S46dunbX4mIlzzGgkpv4zgbYP85jeY9Vhlx6Hsby_JFzdMi-LfraatWnJOQltVnG0XXHeNAJ9Qxp-u5rlW2q1zp0YbyULz3uX6nbMORBWSB04o5-evQBjNTziTkJ84nbwdbKPtrOsN3Ff5pt0vjfHN9bPAl0cGpH3bsIg6tAWEXDjn0e-QQLj6CTTaDbkT3luD7aYHeJTbQalKM4O5H7-1rxetINlkIOetLttw";

const ws = new WebSocket( `wss://localhost:8080/somewhere/path?token=${JWT}`, { rejectUnauthorized: false } );

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
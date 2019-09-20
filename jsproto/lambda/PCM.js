"use strict"

const dgram = require( "dgram" );

const PORT = 33333;
const HOST = "127.0.0.1";

let server = dgram.createSocket( "udp4" );

server.on( "listening", () => {
    let address = server.address();
    console.log( "PCM.js listening on " + address.address + ":" + address.port );
});

server.on( "message", ( message, remote ) => {
    console.log( remote.address + ":" + remote.port +" :::: " + message );
} );

server.bind( PORT, HOST );
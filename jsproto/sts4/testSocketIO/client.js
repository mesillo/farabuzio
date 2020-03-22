"use strict";

const io = require( "socket.io-client" );

let socket = io( "http://localhost:9010", {
  path: "/websoket"
} );

socket.on( "connect", () => {
    console.log( "Connected to the server." );
    //console.dir( arguments, { depth: 0 } );
    //socket.emit( "handshake", { message: "An handshake message" } );
    socket.on( "pingevent", ( payload ) => {
        console.dir(
            payload,
            { depth: null }
        );
        socket.emit( "handshake", { message: "An handshake message" } );
    } );
    socket.on( "message", ( message ) => {
        console.info( "Message from server:" + message );
        //console.dir( arguments, { depth: 0 } );
    } );
} );
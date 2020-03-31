"use strict";

const io = require( "socket.io-client" );

const JWT = "someJWTstring";
//const JWT = "";

let socket = io( "http://localhost:9010", {
	path: "/websocket",
	query: {
		tocken: JWT
	}
} );

socket.on( "connect", () => {
	console.log( "Connected to the server." );
	socket.emit( "handshake", { message: "An handshake message" } );
	dataProducer( 1000 );
} );

socket.on( "disconnect", () => {
	console.log( "Disconnected from server" );
	process.exit();
} );

socket.on( "error", ( error ) => {
	console.log( "== ERROR ==" );
	console.dir( error );
} );

let dataProducer = ( delay ) => {
	setTimeout( () => {
		console.log( "\tdata: " + delay );
		socket.emit( "datachunk", { data : "somedata: " + delay } );
		delay *= 2;
		dataProducer( delay );
	}, delay );
}
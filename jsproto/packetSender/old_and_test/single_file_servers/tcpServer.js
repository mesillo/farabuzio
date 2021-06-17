"use strict";

const PORT = 1620;

const net = require( "net" );

const server = net.createServer( ( socket ) => {
	//socket.write( "ACK" );
	//socket.pipe( socket );
	socket.on( "error", ( error ) => {
		console.error( error );
	} );

	socket.on( "close", () => {
		console.info( "Connection Closed" );
	} );

	socket.on( "data", ( data ) => {
		//console.info( `Received: ${data}` );
		console.info( data );
		socket.write( "ACK", ( error ) => {
			console.error( "Error on Write" );
			console.error( error );
		} );
	} );
} );

server.listen( PORT, "127.0.0.1", () => {
	console.info( `Listen on: ${PORT}.` );
} );

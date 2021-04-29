"use strict";

const PORT = 1620;
const TIMEOUT = 6000;
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
		console.info( data.toString() );
		socket.write( "ACK", ( error ) => {
			if( error ) {
				console.error( "Error on Write" );
				console.error( error );
			}
		} );
	} );
	socket.setTimeout( TIMEOUT );
	socket.on( "timeout", () => {
		console.log( "Socket timeout ===> end()" );
		socket.end();
	} );
} );

server.listen( PORT, "127.0.0.1", () => {
	console.info( `Listen on: ${PORT}.` );
} );

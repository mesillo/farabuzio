"use strict";

const PORT = 1620;
const HOST = "127.0.0.1";

const net = require( "net" );

const client = new net.Socket();

client.connect( PORT, HOST, () => {
	client.write( "TEST_DATA" );
} );

client.on( "data", ( data ) => {
	console.log( "Received: " + data );
	console.log( "Exit for test." ); process.exit( 0 );
} );

client.on( "close", () => {
	console.log( "closed event" );
} );

client.on( "error", ( error ) => {
	console.error( error );
} );
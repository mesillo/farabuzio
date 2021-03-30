"use strict";

const net = require( "net" );

const server = net.createServer( ( socket ) => {
	socket.write( "ACK" );
	//socket.pipe( socket );
} );

server.listen( 1620, "127.0.0.1" );

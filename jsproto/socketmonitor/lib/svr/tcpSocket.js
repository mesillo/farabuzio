"use strict";

const net = require( "net" );

class TcpSocket {
	constructor( port ) {
		this.port = port;
		this.server = net.createServer( ( socket ) => {
			socket.pipe( socket );
		} );
		this.server.listen( port, "127.0.0.1" );
	}
}

module.exports = TcpSocket;
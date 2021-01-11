"use strict";

const TcpSocket = require( "./lib/svr/tcpSocket" );

const PORT = 2468;

class Client {
	constructor( port ) {
		this.port = port;
		this.server = new TcpSocket( port );
	}
}

let srv = new Client( PORT );

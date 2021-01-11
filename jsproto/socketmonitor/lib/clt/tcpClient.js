"use strict";

const net = require( "net" );

class TcpClient{
	constructor( port, host = "127.0.0.1", verbose = true ) {
		this.port = port;
		this.host = host;
		this.verbose = verbose;
		this.client = new net.Socket();
		this._doConnect();
	}

	_doConnect() {
		this.client.connect( this.port, this.host, () => {
			if( this.verbose ) {
				console.log( `Connected to ${this.host}:${this.port}.` );
			}
		});
	}
}

module.exports = TcpClient;

/// example ///
/*var client = new net.Socket();
client.connect(1337, '127.0.0.1', function() {
	console.log('Connected');
	client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});*/
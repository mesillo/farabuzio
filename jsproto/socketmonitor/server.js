"use strict";

const TcpSocket = require( "./lib/svr/tcpSocket" );
const SocketMonitor = require( "./lib/socketMonitor/socketMonitor" );

const PORT = 12345;
const PERIOD = 5000;

class Server {
	constructor( port, period ) {
		this.port = port;
		this.period = period;
		this.server = new TcpSocket( port );
		this.socketMonitor = new SocketMonitor( port );
	}

	startMonitoring() {
		this.monitor = setInterval( () => {
			this.socketMonitor.getData();
		}, this.period );
	}
}

let srv = new Server( PORT, PERIOD );
srv.startMonitoring();
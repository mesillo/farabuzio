"use strict";

const TcpSocket = require( "./lib/svr/tcpSocket" );
const TcpClient = require( "./lib/clt/tcpClient" );
const SocketMonitor = require( "./lib/socketMonitor/socketMonitor" );

const PORT = 12345;
const PORT2 = 56789;
const PERIOD = 5000;

class Server {
	constructor( port, port2, period ) {
		this.port = port;
		this.period = period;
		this.server = new TcpSocket( port );
		this.server2 = new TcpSocket( port2 );
		this.socketMonitor = new SocketMonitor( port );
	}

	startMonitoring( callback ) {
		this.monitor = setInterval( () => {
			this.socketMonitor.getData( callback );
		}, this.period );
	}
}

let srv = new Server( PORT, PORT2, PERIOD );
srv.startMonitoring( console.dir );
let clt = new TcpClient( 2468 );
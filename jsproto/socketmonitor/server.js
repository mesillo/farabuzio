"use strict";

const TcpSocket = require( "./lib/svr/tcpSocket" );
const SocketMonitor = require( "./lib/socketMonitor/socketMonitor" );

let server = new TcpSocket( 12345 );

let socketMonitor = new SocketMonitor();

setInterval( () => {
	socketMonitor.getData();
}, 5000 );
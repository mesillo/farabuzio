"use strict";

const socketio = require( "socket.io" );
const http = require( "http" );
const https = require( "https" );

const ioOptions = {
	serveClient: false,
	cookie: false,
	path: "/websocket"
};
const generalOption = {
	port: 9010,
	agent: http,
	agentOptions: {}
};

class ProtocolManager {
	constructor( socket, tockenInfo ) {
		this.socket = socket;
		this.tockenInfo = tockenInfo;
		this._setUpEvents();
	}

	_setUpEvents() {
		this.socket.on( "message", ( message ) => {
			console.log( "=== generic Message from client ===" );
			console.log( "===================================" );
			console.log( message );
		} );
		this.socket.on( "handshake", ( message ) => {
			console.log( "=== Handshake from client ===" );
			console.dir( message );
			//this.socket.emit( "ack", { ackdata : "somedata" } ); //TODo: test this... this... 
		} );
		this.socket.on( "data", ( message ) => {
			console.log( "=== Data from client ===" );
			console.dir( message );
		} );
	}
}

let webServer = generalOption.agent.createServer( generalOption.agentOptions );
let io = socketio( webServer, ioOptions );

io.use( ( socket, next ) => {
	console.log( "==== MIDDLEWARE ====" );
	if( ! socket.handshake.query.tocken || socket.handshake.query.tocken === "" ) {
		console.log( "== Unauthorized ==" );
		//next( new Error( "Authentication error" ) );
		//socket.disconnect( true );
		socket.error( {
			code : 401,
			message : "Authentication error!",
			info : {}
		} );
		socket.disconnect( true );
	} else {
		// TODO: move here the protocol creation... things in connect handler.
		next();
	}
} );

io.on( "connect", ( socket ) => {
	console.info( "Server get connection from " + socket.id );
	let tockenInfo = socket.handshake.query.tocken;
	let protocolManager = new ProtocolManager( socket, tockenInfo );
} );

webServer.listen( generalOption.port );

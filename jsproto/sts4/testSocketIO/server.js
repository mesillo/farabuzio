"use strict";

const socketio = require( "socket.io" );
const http = require( "http" );
const https = require( "https" );
const url = require( "url" );

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

let httpRequestListener = ( request, response ) => {
	console.log( "=== HTTP Server ===" );
	const urlObj = url.parse( request.url, true );
	console.dir( urlObj.query );
	console.log( "===================" );
};

//let webServer = generalOption.agent.createServer( generalOption.agentOptions, httpRequestListener );
let webServer = generalOption.agent.createServer( generalOption.agentOptions );
let io = socketio( webServer, ioOptions );

io.use( ( socket, next ) => {
	console.log( "==== MIDDLEWARE ====" );
	//let queryObj = url.parse( socket.handshake.query, true );
	//console.dir( socket.handshake.query );
	//console.dir( socket.request );
	//console.dir( socket.request.connection );
	if( ! socket.handshake.query.tocken || socket.handshake.query.tocken === "" ) {
		console.log( "== Unauthorized ==" );

		next( new Error( "Authentication error") );
		socket.disconnect( true );
	} else {
	// TODO: e di next che me ne faccio??? Puoi passargli error...
		next();
	}
} );

io.on( "connect", ( socket ) => {
	console.info( "Server get connection from " + socket.id );
	//socket.emit( "pingevent", { ping: 0 } );
	//console.dir( socket.handshake.query );
	//if( ! socket.handshake.query.tocken || socket.handshake.query.tocken === "" ) {
	//	console.log( "== Unauthorized ==" );
	//	socket.disconnect( true );
	//}
	let tockenInfo = socket.handshake.query.tocken;
	let protocolManager = new ProtocolManager( socket, tockenInfo );
	//socket.send( "Welcome " +  socket.id + "!" );
	//console.dir( arguments );
} );

webServer.listen( generalOption.port );

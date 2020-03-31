"use strict";

const socketio = require( "socket.io" );
const http = require( "http" );
const https = require( "https" );
const fs = require( "fs" );

const httpsOptions = {
	cert: fs.readFileSync( "../keys/cert.pem" ),
	key: fs.readFileSync( "../keys/key.pem" ) // or Buffers... :-|
};

const ioOptions = {
	serveClient: false,
	cookie: false,
	path: "/websocket"
};
const generalOption = {
	port: 9010,
	agent: https,
	agentOptions: httpsOptions
};

class DatachunkProcessor {
	constructor( handshakePayload ) {
		this._handshakePayload = handshakePayload;
	}

	processChuck( data ) {
		console.log( "DatachunkProcessor.processChuck" );
	}
}

class ProtocolManager {
	constructor( socket, tockenInfo ) {
		this.socket = socket;
		this.tockenInfo = tockenInfo;
		this._setUpStatus();
		this._setUpEvents();
	}

	_setUpEvents() {
		this.socket.on( "handshake", ( data ) => {
			ProtocolManager.handshakeHandler( data, this );
		} );
		this.socket.on( "datachunk", ( data ) => {
			ProtocolManager.datachunkHandler( data, this );
		} );
	}

	static handshakeHandler( data, protocolManager ) {
		console.log( "== handshakeHandler ==" );
		protocolManager.status.datachunkProcessor = new DatachunkProcessor( data );
		protocolManager.socket.emit( "handshakeAck", { handshakeAck : "somedata" } );
		//console.dir( arguments, { depth : null } );
	}

	static datachunkHandler( data, protocolManager ) {
		console.log( "== datachunkHandler ==" );
		if( protocolManager.status.datachunkProcessor !== null ) {
			let message = protocolManager.status.datachunkProcessor.processChuck( data );
			protocolManager.socket.emit( "datachunkAck", { datachunkAck : "somedata" } );
		}
		//console.dir( arguments, { depth : null } );
	}

	_setUpStatus() {
		this.status = {
			datachunkProcessor : null,
			lastId : null
		}
	}
}

let webServer = generalOption.agent.createServer( generalOption.agentOptions );
let io = socketio( webServer, ioOptions );

io.use( ( socket, next ) => {
	console.log( "==== MIDDLEWARE ====" );
	if( ! socket.handshake.query.tocken || socket.handshake.query.tocken === "" ) {
		console.log( "== Unauthorized ==" );
		socket.error( {
			code : 401,
			message : "Authentication error!",
			info : {}
		} );
		socket.disconnect( true );
	} else {
		let tockenInfo = socket.handshake.query.tocken;
		let protocolManager = new ProtocolManager( socket, tockenInfo );
		next();
	}
} );

webServer.listen( generalOption.port );

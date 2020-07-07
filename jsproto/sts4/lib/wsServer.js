"use strict";

//const webSocket = require( "ws" );
const webSocket = require( "socket.io" );
const http = require( "http" );
const https = require( "https" );
const url = require( "url" );

const UniversaWsReceiver = require( "./universalWsReceiver" );

const UNAUTHORIZED_CODE = 3401;
const UNAUTHORIZED_STRING = "Unauthorized.";

const socketIOoptions = {
	path: "/",
	serveClient: false,
	// below are engine.IO options
	pingInterval: 10000,
	pingTimeout: 5000,
	cookie: false
};

class WsReceiver {
	constructor( options ) {
		this.options = options;
		this.webServer = this._getWebServer();
		this.socketServer = webSocket( this.webServer, socketIOoptions );
		this._setUpEventsHandlers();
	}

	_getWebServer() {
		if( this.options.protocol === "https" ) {
			if( this.options.httpsOptions ) {
				console.info( "Secured WS whit configuration." );
				return https.createServer( this.options.httpsOptions ); // TODO: Parse and adapt.
			}
			console.info( "Secured WS whitout configuration." );
			return https.createServer();
		}
		console.info( "Unecured WS." );
		return http.createServer();
	}

	_setUpConnectionEvent() {
		this.socketServer.on( "connection", ( webSocket, incomingMessage ) => {
			console.dir( arguments.length, { depth : null } );
			this._webSocketHandler( webSocket, incomingMessage, this.options );
		} );
	}

	_setUpEventsHandlers() {
		this._setUpConnectionEvent();
	}

	async _webSocketHandler( webSocket, incomingMessage, options ) {
		let getData = url.parse( incomingMessage.url, true );
		let headers = incomingMessage.headers;
		console.log( "=== connection ===" );
		// TODO: verify token.
		let jwtTocken = getData.query.token;
		if( options.tokenValidator && jwtTocken ) { // TODO make more controls... more sensed controls...
			try {
				let clientInfo = await options.tokenValidator.verifyJWTToken( jwtTocken );
				console.log( "=== Autenticated ===" );
				// TODO: start comunications.
				new UniversaWsReceiver( webSocket, clientInfo ); //TODO: mantain a reference and drop after close???
			} catch( error ) { // Client not autenticated. // TODO: use error for better error message: server can be unable to obtain keys from start...
				console.log( "=== not autenticated ===" );
				console.dir( error );
				webSocket.close( UNAUTHORIZED_CODE, UNAUTHORIZED_STRING );
			}
		} else {
			throw new Error( "WsReceiver unable to autenticate the client" ); //TODO: close connection with a 403;
		}
	}

	run() {
		this.webServer.listen( this.options.port );
	}
}

module.exports = WsReceiver;

"use strict";

const webSocket = require( "ws" );
const http = require( "http" );
const https = require( "https" );
const url = require( "url" );

class WsReceiver {
	constructor( options ) {
		this.options = options;
		this.webServer = this._getWebServer();
		this.socketServer = new webSocket.Server( { server : this.webServer } );
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
		this.socketServer.on( "connection", this._webSocketHandler );
	}

	_setUpEventsHandlers() {
		this._setUpConnectionEvent();
	}

	_webSocketHandler( webSocket, incomingMessage ) {
		///webSocket.on( "message", WsReceiver._messageHandler );
		let getData = url.parse( incomingMessage.url, true );
		let headers = incomingMessage.headers;
		console.log( "=== connection ===" );
		// TODO: verify token.
	}

	static _messageHandler( message ) { // for debug prurpose at the moment...
		console.log( "=== message ===" );
		console.dir(
			message,
			{ depth : 1 }
		);
	}

	run() {
		this.webServer.listen( this.options.port );
	}
}

module.exports = WsReceiver;

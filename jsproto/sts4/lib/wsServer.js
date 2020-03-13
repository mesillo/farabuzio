"use strict";

const webSocket = require( "ws" );
const http = require( "http" );
const https = require( "https" );
const url = require( "url" );
//const wssOptions = {
//    port: 8080,
//    perMessageDeflate: {
//        zlibDeflateOptions: {
//            // See zlib defaults.
//            chunkSize: 1024,
//            memLevel: 7,
//            level: 3
//        },
//        zlibInflateOptions: {
//            chunkSize: 10 * 1024
//        },
//        // Other options settable:
//        clientNoContextTakeover: true, // Defaults to negotiated value.
//        serverNoContextTakeover: true, // Defaults to negotiated value.
//        serverMaxWindowBits: 10, // Defaults to negotiated value.
//        // Below options specified as default values.
//        concurrencyLimit: 10, // Limits zlib concurrency for perf.
//        threshold: 1024 // Size (in bytes) below which messages
//        // should not be compressed.
//    }
//};
/*const options = {
	port: 8080,
	protocol: "https",
	httpsOptions: {
		cert: "",
		key: "" // or Buffers... :-|
	}
};*/

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
		console.dir(
			incomingMessage.headers,
			{ depth : null }
		);
		console.dir(
			url.parse( incomingMessage.url, true ),
			{ depth : 1 }
		);
		/*console.dir(
			incomingMessage.headers,
			{ depth : null }
		);*/
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

//const fs = require('fs');
//const https = require('https');
//const WebSocket = require('ws');
// 
//const server = https.createServer({
//  cert: fs.readFileSync('/path/to/cert.pem'),
//  key: fs.readFileSync('/path/to/key.pem')
//});
//const wss = new WebSocket.Server({ server });
// 
//wss.on('connection', function connection(ws) {
//  ws.on('message', function incoming(message) {
//    console.log('received: %s', message);
//  });
// 
//  ws.send('something');
//});
// 
//server.listen(8080);
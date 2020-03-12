"use strict";

const webSocket = require( "ws" );
const http = require( "http" );
const https = require( "https" );
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
    }

    _getWebServer() {
        if( this.options.protocol === "https" ) {
            if( this.options.httpsOptions ) {
                return https.createServer( this.options.httpsOptions ); // TODO: Parse and adapt.
            }
            return https.createServer();
        }
        return http.createServer();
    }

    _setUpConnectionEvent() {
        this.socketServer.on( "connection", this._webSocketHandler );
    }

    _webSocketHandler( socket ) {
        console.dir(
            socket,
            { depth: null }
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
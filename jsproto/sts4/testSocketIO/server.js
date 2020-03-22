"use strict";

const socketio = require( "socket.io" );
const http = require( "http" );
const https = require( "https" );

const ioOptions = {
    serveClient: false,
    cookie: false,
    path: "/websoket"
};
const generalOption = {
    port: 9010,
    agent: http,
    agentOptions: {}
};

class protocolManager {
    constructor( socket ) {
        this.socket = socket;
        this._setUpEvents();
    }

    _setUpEvents() {
		this.socket.on( "message", ( message ) => {
			console.log( message );
		} );
		this.socket.on( "handshake", ( message ) => {
			console.dir( message );
		} );
	}
}

let webServer = generalOption.agent.createServer( generalOption.agentOptions );
let io = socketio( webServer, ioOptions );

io.on( "connect", ( socket ) => {
	console.info( "Server get connection from " + socket.id );
	socket.emit( "pingevent", { ping: 0 } );
	//socket.send( "Welcome " +  socket.id + "!" );
    //console.dir( arguments );
} );

webServer.listen( generalOption.port );

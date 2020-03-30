"use strict";

const io = require( "socket.io-client" );

//const JWT = "someJWTstring";
const JWT = "";

//let socket = io( "http://localhost:9010/websoket", {} );
//let socket = io( "http://localhost:9010/websoket?tocken=" + JWT );
let socket = io( "http://localhost:9010", {
	path: "/websocket",
	query: {
		tocken: JWT
	}
} );

socket.on( "connect", () => {
	console.log( "Connected to the server." );
	//console.dir( arguments, { depth: 0 } );
	//socket.emit( "handshake", { message: "An handshake message" } );
	//socket.on( "pingevent", ( payload ) => {
	//    console.dir(
	//        payload,
	//        { depth: null }
	//    );
	//    socket.emit( "handshake", { message: "An handshake message" } );
	//} );
	socket.emit( "handshake", { message: "An handshake message" } );
	dataProducer( 1000 );
	/*socket.on( "message", ( message ) => {
		console.info( "Message from server:" + message );
		//console.dir( arguments, { depth: 0 } );
	} );*/
} );

socket.on( "disconnect", () => {
	console.log( "Disconnected from server" );
	//console.dir( arguments, { depth : 0 } );
	process.exit();
} );

socket.on( "error", ( error ) => {
	console.log( "== ERROR ==" );
	//console.dir( arguments, { depth : 0 } );
	console.dir( error );
} );

let dataProducer = ( delay ) => {
	setTimeout( () => {
		console.log( "\tdata: " + delay );
		socket.emit( "data", { data : "somedata: " + delay } );
		delay *= 2;
		dataProducer( delay );
	}, delay );
}
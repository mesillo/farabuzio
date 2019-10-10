"use strict"

const fs = require( "fs" );
const dgram = require( "dgram" );

//let output = "./output.log";
const PORT = 33333;
const HOST = "10.0.75.1";

let JSONEvent = async ( event, context ) => {
	//console.log( "===" + ( new Date() ).toString() + "===" );
	//console.log( JSON.stringify( event ) );
	//fs.appendFileSync( output, "===" + ( new Date() ).toString() + "===" );
	//fs.appendFileSync( output, JSON.stringify( event ) );

	let message = Buffer.from( "===" + ( new Date() ).toString() + "===\n" + JSON.stringify( event ) );
	let UDPclient = dgram.createSocket( "udp4" );
	UDPclient.send( message, 0, message.length, PORT, HOST, ( error, bytes ) => {
		if( error ) throw error;
		UDPclient.close();
	} );

	return 0;
};
exports.handler = JSONEvent;
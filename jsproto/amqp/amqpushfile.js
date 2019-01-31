#!/usr/bin/env node

"use strict"

let amqp = require( "amqplib/callback_api" );
//let readline = require( "readline" );
//let readline = require('readline');
let fs = require( "fs" );

let serverUrl = "amqp://localhost";
let queueName = "amqpTest";
let filename = "./raw.txt";

//let rl = readline.createInterface({
//	input: process.stdin,
//	output: process.stdout,
//	terminal: false
//});

if( process.argv[ 2 ] !== undefined )
	queueName = process.argv[ 2 ];
if( process.argv[ 3 ] !== undefined )
	serverUrl = process.argv[ 3 ];
if( process.argv[ 4 ] !== undefined )
	filename = process.argv[ 4 ];

//let rl =readline.createInterface( {
//	input: require('fs').createReadStream( filename ),
//	crlfDelay: Infinity
//} );

amqp.connect( serverUrl, ( error, connection ) => {
	if( error ) {
		console.error( error );
		return;
	}
	connection.createChannel( ( error, channel ) => {
    	if( error ) {
			console.error( error );
			return;
		}
		
		let messageIndex = 0;
    	//let msg = "Hello World!";
		//channel.assertQueue( queueName, { durable: false } );
		//console.log( "Setting handler..." );
		//rl.on( "line", ( line ) => {
		//	console.log( "Sending line: " + line );
		//	channel.sendToQueue( queueName, Buffer.from( line ) );
		//	console.log( Date() + ": Sent message " + (++messageIndex) + " to " + queueName );
		//} );
		//console.log( "... done!" );
		let data = fs.readFileSync(filename, 'utf8');
		let lines = data.split("\n");
		for( const line of lines ) {
			//console.log( "Sending line: " + line );
			channel.sendToQueue( queueName, Buffer.from( line ) );
			console.log( Date() + ": Sent message " + (++messageIndex) + " to " + queueName );
		}		
		//console.log( " [x] Sent %s", msg );
	});
	/*setTimeout( () => {
		conn.close();
		process.exit(0)
	}, 500 );*/
});
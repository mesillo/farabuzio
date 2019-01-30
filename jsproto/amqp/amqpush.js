#!/usr/bin/env node

"use strict"

let amqp = require( "amqplib/callback_api" );
let readline = require( "readline" );

let serverUrl = "amqp://localhost";
let queueName = "amqpTest";

let rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

if( process.argv[ 2 ] !== undefined )
	queueName = process.argv[ 2 ];
if( process.argv[ 3 ] !== undefined )
	serverUrl = process.argv[ 3 ];

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
		
		let closeconnectionfn = () => {
			connection.close();
			console.log( "... done!" );
			process.exit( 0 );
		};

		let messageIndex = 0;
		//channel.assertQueue( queueName, { durable: false } );
		rl.on( "line", ( line ) => {
			channel.sendToQueue( queueName, Buffer.from( line ) );
			console.log( Date() + ": Sent message " + (++messageIndex) + " to " + queueName );
		} );
	});
});

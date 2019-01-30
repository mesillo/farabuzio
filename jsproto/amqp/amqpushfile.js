#!/usr/bin/env node

"use strict"

let amqp = require( "amqplib/callback_api" );
let fs = require( "fs" );

let serverUrl = "amqp://localhost";
let queueName = "amqpTest";
let filename = "./raw.txt";

if( process.argv[ 2 ] !== undefined )
	queueName = process.argv[ 2 ];
if( process.argv[ 3 ] !== undefined )
	serverUrl = process.argv[ 3 ];
if( process.argv[ 4 ] !== undefined )
	filename = process.argv[ 4 ];

amqp.connect( serverUrl, ( error, connection ) => {
	if( error ) {
		console.error( error );
		return;
	}

	let closeconnectionfn = () => {
		connection.close();
		console.log( "... done!" );
		process.exit( 0 );
	};

	connection.createChannel( ( error, channel ) => {
    	if( error ) {
			console.error( error );
			return;
		}
		let messageIndex = 0;
		//channel.assertQueue( queueName, { durable: false } );
		let data = fs.readFileSync(filename, 'utf8');
		let lines = data.split("\n");
		for( const line of lines ) {
			channel.sendToQueue( queueName, Buffer.from( line ) );
			console.log( Date() + ": Sent message " + (++messageIndex) + " to " + queueName );
		}
		closeconnectionfn();
	});
});

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
	connection.createChannel( ( error, channel ) => {
    /*if( error ) {
      console.log( error );
    }*/
    //let msg = "Hello World!";
//		channel.assertQueue( queueName, { durable: false } );

		rl.on( "line", ( line ) => {
			channel.sendToQueue( queueName, Buffer.from( line ) );
		} );
		//console.log( " [x] Sent %s", msg );
	});
	/*setTimeout( () => {
		conn.close();
		process.exit(0)
	}, 500 );*/
});

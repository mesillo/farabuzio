#!/usr/bin/env node

"use strict"

let amqp = require( "amqplib/callback_api" );

let serverUrl = "amqp://localhost";
let queueName = "amqpTest";

if( process.argv[ 2 ] !== undefined )
	queueName = process.argv[ 2 ];
if( process.argv[ 3 ] !== undefined )
	serverUrl = process.argv[ 3 ];

amqp.connect( serverUrl, ( error, connection ) => {
	if( ! error ) {
		connection.createChannel( ( error, channel ) => {
			if( ! error ) {
				//let queue = "hello";

				//channel.assertQueue( queueName, { durable: false });
				//console.log( " [*] Waiting for messages in %s. To exit press CTRL+C", queue );
				channel.consume( queueName, function( msg ) {
					//console.log( " [x] Received %s", msg.content.toString() );
					console.log( msg.content.toString() );
				} );
			} else {
				console.log( "createChannel() - error - ", error.message );
			}
		},
		//{ noAck: true }
		{}
		);
	} else {
		console.log( "=== ERROR ===" );
		console.log( error );
		console.log( "=============" );
	}
});

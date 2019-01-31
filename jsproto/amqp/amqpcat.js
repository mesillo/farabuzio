#!/usr/bin/env node

"use strict"

let amqp = require( "amqplib/callback_api" );

let serverUrl = "amqp://localhost";
let queueName = "amqpTest";

let connectionHandler = null;

if( process.argv[ 2 ] !== undefined )
	queueName = process.argv[ 2 ];
if( process.argv[ 3 ] !== undefined )
	serverUrl = process.argv[ 3 ];

let closeConnection = () => {
	if( connectionHandler ) {
		connectionHandler.close();
		connectionHandler = null;
	}
};

process.on( "SIGINT", () => {
	closeConnection();
	console.error( "... exiting!" );
	process.exit( 0 );
});

amqp.connect( serverUrl, ( error, connection ) => {
	if( ! error ) {
		connectionHandler = connection; //saving connection for future operations... eg. close.
		connection.createChannel( ( error, channel ) => {
			if( ! error ) {
				//channel.assertQueue( queueName, { durable: false });
				channel.consume( queueName, function( msg ) {
					console.log( msg.content.toString() );
				}, { noAck: true } );
			} else {
				console.error( "createChannel() - error - ", error.message );
			}
		});
	} else {
		console.error( "====== ERROR ======" );
		console.error( error );
		console.error( "===================" );
	}
});

//#!/usr/bin/env node

"use strict"

let amqp = require('amqplib/callback_api');

amqp.connect( "amqp://localhost", ( error, connection ) => {
	connection.createChannel( ( error, channel ) => {
		let queue = 'hello';
		let msg = 'Hello World!';
		channel.assertQueue( queue, { durable: false } );
		channel.sendToQueue( queue, Buffer.from( msg ) );
		//console.log( " [x] Sent %s", msg );
	});
	/*setTimeout( () => {
		conn.close();
		process.exit(0)
	}, 500 );*/
});
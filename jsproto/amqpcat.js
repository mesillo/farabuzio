// #!/usr/bin/env node

"use strict"

let amqp = require( "amqplib/callback_api" );

amqp.connect( "amqp://localhost", function( error, connection ) {
	connection.createChannel( function( error, channel ) {
		var queue = "hello";

		channel.assertQueue( queue, { durable: false });
		//console.log( " [*] Waiting for messages in %s. To exit press CTRL+C", queue );
		channel.consume( queue, function( msg ) {
		//console.log( " [x] Received %s", msg.content.toString() );
		console.log( msg.content.toString() );
	}, { noAck: true });
	});
});

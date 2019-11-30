"use strict";

const KinesaliteClient = require( "./kinesaliteClient" );

let kinesis = new KinesaliteClient();
let streamName = "testStream";
let shardNum = 2;

kinesis.createStream( streamName, shardNum )
	.then( async ( createResult ) => {
		/*kinesis.waitForStream( streamName )
			.then( () => {
			} );*/
		await kinesis.waitForStream( streamName );
		/*console.dir(
			await kinesis.listConsumers( streamName ),
			{ depth : null }
		);*/
	} );

kinesis.listStreams()
		.then( ( strList ) => {
			console.dir( strList );
			/*for( let streamName of strList ) {
				kinesis.deleteStream( streamName );
			}*/
		} );

kinesis.streamExists( streamName )
	.then( console.dir );
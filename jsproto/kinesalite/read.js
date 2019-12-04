"use strict";

const KinesaliteClient = require( "./kinesaliteClient" );

let kinesis = new KinesaliteClient();
let streamName = "testStream";
let shardNum = 2;

//kinesis.createStream( streamName, shardNum )
//	.then( ( createResult ) => {
		kinesis.waitForStream( streamName )
			.then( () => {
				kinesis.readStream( streamName );
			} );
//	} );

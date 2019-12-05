"use strict";

const KinesaliteStreamClient = require( "./kinesaliteStreamClient" );

const BATCH = 5;

const handler = ( records ) => {
	console.dir(
		records,
		{ depth : null }
	);
};

let streamName = "testStream";

let stream = new KinesaliteStreamClient( streamName, BATCH );

stream.read( handler );


/*
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
*/
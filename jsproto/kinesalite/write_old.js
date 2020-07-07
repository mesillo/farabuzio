"use strict";

const KinesaliteStreamClient = require( "./kinesaliteStreamClient" );

let streamName = "testStream";
let shardNum = 1;

let stream = new KinesaliteStreamClient( streamName, shardNum );

for( let index = 0 ; index < 10 ; index++ )
	stream.write( "Dati buttati " + index );

console.log( "Done" );


/*
const KinesaliteClient = require( "./kinesaliteClient" );

let kinesis = new KinesaliteClient();
let streamName = "testStream";
let shardNum = 2;
let writeTimer = 2000;

//kinesis.createStream( streamName, shardNum )
//	.then( ( createResult ) => {
		kinesis.waitForStream( streamName )
			.then( () => {
				let i = 0;
				setInterval(
					() => {
					let streamData = `ShardData number ${i}`;
					let partKey = `${i++}`;
					kinesis.writeStream( streamName, streamData, partKey )
						.then( ( writeData ) => {
							console.log( `Writed: ${streamData}.` );
						} );
					},
					writeTimer
				);
			} );
//	} );
*/
"use strict";

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

"use strict";

const KinesaliteClient = require( "./kinesaliteClient" );

let kinesis = new KinesaliteClient();
let streamName = "testStream";
let shardNum = 2;

kinesis.createStream( streamName, shardNum )
	.then( ( createResult ) => {
		//console.log( "Created" );
		/*kinesis.describeStream( streamName )
			.then( console.dir );*/
		kinesis.waitForStream( streamName )
			.then( () => {
				kinesis.writeStream( streamName, "PippoPluto", "1" )
					.then( ( writeData ) => {
						kinesis.describeStream( streamName )
							.then( ( describeData ) => {
								console.dir( describeData );
							} );
					} );
			} );
	} );

/*
const kinesis = require( "kinesis" );
const kinesisStream = kinesis.KinesisStream;
const kinesisConfiguration = {
	region :  "http://localhost:4567"
};
let kinesalite = new kinesisStream( kinesisConfiguration ); //NO!!!
*/
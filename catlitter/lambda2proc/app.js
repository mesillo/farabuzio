"use strict";

const configurations = require( "./etc/config.json" );
const L2P = require( "./includes/l2p/l2p" );
const KinesaStream = require( "./includes/kinesalite/kinesaliteStreamClient" );

const kinesisHandler = ( records ) => {
	console.dir(
		records,
		{ depth : null }
	);
};

const runLambdaProcess = ( options ) => {
	let lambda = new L2P( options );
	let stream = new KinesaStream( options.streamName );
	stream.read( kinesisHandler );
};

let options = {
	functionName : null,
	streamName : null,
	lambdasStorage : configurations.lambdasStorage
};
for( let i = 0  ; i < process.argv.length ; i++ ) {
	switch( process.argv[ i ] ) {
		case "--function-name":
			options.functionName = process.argv[++i];
			break;
		case "--stream-name":
			options.streamName = process.argv[++i];
			break;
	}
}
///// Main Task /////
runLambdaProcess( options );

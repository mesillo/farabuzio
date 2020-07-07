#!/usr/bin/env node

"use strict";
const KinesaliteStreamClient = require( "./kinesaliteStreamClient" );

const readline = require( "readline" );
const zlib = require( "zlib" );

let options = {
	streamName: "testStream",
	shardNum: 1,
	zipPayload: false
};

let rl = readline.createInterface( {
  input: process.stdin,
  output: process.stdout,
  terminal: false
} );

rl.on( "line", async ( line ) => {
	let linebuf = Buffer.from( line );
	if( options.zipPayload )
		linebuf = zlib.gzipSync( linebuf );
	stream.write( linebuf ); //TODO: or JSON.parse( line );???
} );

// Parameter reading
for( let i = 0  ; i < process.argv.length ; i++ ) {
	switch( process.argv[ i ] ) {
		case "--stream-name":
			options.streamName = process.argv[++i];
			break;
		case "--shard-number":
			options.shardNum = parseInt( process.argv[++i] );
			break;
		case "--zip-payload":
			options.zipPayload = true;
			break;
	}
}
//// Init Stream ////
let stream = new KinesaliteStreamClient( options.streamName, options.shardNum );

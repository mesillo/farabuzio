#! /usr/bin/env node
"use strict";

const fs = require( "fs" );
const Executor = require( "../lib/executor/executor" );
//const zlib = require( "zlib" );

///// Functions /////
let pushStream = async ( streamName, fileName ) => {
	let data = fs.readFileSync( fileName, "utf8" );
	let lines = data.split( "\n" );
	for( let line of lines ) {
		try {
			let record = JSON.parse( line );
			await streamWrite( streamName, record );
		} catch( error ) {
			console.log( line );
		}
	}
};

let streamWrite = ( streamName, record ) => {
	return new Promise( ( resolve, reject ) => {
		let data = Buffer.from( record.Data, "base64" ).toString();
		Executor.execute( `awslocal kinesis put-record --stream-name ${streamName} --partition-key ${record.PartitionKey} --data ${data}` )
			.then( async ( streams ) => {
				resolve();
			} )
			.catch( ( error ) => {
				console.error( error );
				reject( error );
			} );
	} );
};

let options = {
	fileName : "test.json",
	streamName : "test"
};
// Parameter reading
for( let i = 0  ; i < process.argv.length ; i++ ) {
	switch( process.argv[ i ] ) {
		case "--file-name":
			options.fileName = process.argv[++i];
			break;
		case "--stream-name":
			options.streamName = process.argv[++i];
			break;
	}
}

/// Main Task ///
pushStream( options.streamName, options.fileName );
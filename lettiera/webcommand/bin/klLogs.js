#! /usr/bin/env node
"use strict";

const fs = require( "fs" );
const Executor = require( "../lib/executor/executor" );
let kinesis = null; // istance of AWS.kinesis from aws-sdk.
const kinesisConfig = {
	region : "us-east-1",
	endpoint : "http://localhost:4568"
};

///// Functions /////
let pushStream = async ( streamName, fileName ) => {
	let data = fs.readFileSync( fileName, "utf8" );
	let lines = data.split( "\n" );
	for( let line of lines ) {
		try {
			let record = JSON.parse( line );
			if( options.binaryPayload ) {
				if( ! kinesis ) {
					//console.info( "Load AWS-SDK..." );
					kinesis = new (require( "aws-sdk" ).Kinesis)( kinesisConfig );
					//console.info( "... done!" );
				}
				await streamBinaryWrite( streamName, record );
			} else {
				await streamWrite( streamName, record );
			}
		} catch( error ) {
			console.error( error );
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

let streamBinaryWrite = ( streamName, record ) => {
	return new Promise( ( resolve, reject ) => {
		let data = Buffer.from( record.Data, "base64" );
		let recordParams = {
			Data : data,
			PartitionKey : record.PartitionKey,
			StreamName : streamName
		};
		kinesis.putRecord( recordParams, ( error, data ) => {
			if( error ) {
				reject( error );
			} else {
				//console.log( data );
				resolve( data ); // data???
			}
		} );
	} );
};

let options = {
	fileName : "test.json",
	streamName : "test",
	binaryPayload : false
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
		case "--binary-payload":
			options.binaryPayload = true;
			break;
	}
}

/// Main Task ///
pushStream( options.streamName, options.fileName );
#! /usr/bin/env node
"use strict";

const Executor = require( "../lib/executor/executor" );
const zlib = require( "zlib" );

///// Functions /////
let readStream = ( streamName ) => {
	Executor.execute( `awslocal kinesis describe-stream --stream-name ${streamName}` )
		.then( async ( streams ) => {
			let describeStream = JSON.parse( streams.stdout );
			let shards = describeStream.StreamDescription.Shards;
			let shradIds = [];
			for( let shard of shards ) {
				console.log( ` ===== ${shard.ShardId} ===== ` );
				await readShard( streamName, shard.ShardId );
			}
		} )
		.catch( ( error ) => {
			console.error( error );
			process.exit( 255 );
		} );
};

let readShard = ( streamName, shardId ) => {
	return new Promise( ( resolve, reject ) => {
		Executor.execute( `awslocal kinesis get-shard-iterator --stream-name ${streamName} --shard-id ${shardId} --shard-iterator-type TRIM_HORIZON` )
			.then( async ( streams ) => {
				let describeShardIterator = JSON.parse( streams.stdout );
				let shardIterator = describeShardIterator.ShardIterator;
				await readRecords( streamName, shardId, shardIterator );
				resolve();
			} )
			.catch( ( error ) => {
				console.error( error );
				reject( error );
			} );
	} );
};

let readRecords = ( streamName, shardId, shardIterator ) => {
	return new Promise( ( resolve, reject ) => {
		Executor.execute( `awslocal kinesis get-records --shard-iterator ${shardIterator}` )
			.then( async ( streams ) => {
				let records = JSON.parse( streams.stdout );
				for( let record of records.Records ) {
					await payloadHandler( streamName, shardId, record );
				}
				if( records.MillisBehindLatest !== 0 ) {
					await readRecords( streamName, shardId, records.NextShardIterator );
				}
				resolve();
			} )
			.catch( ( error ) => {
				console.error( error );
				reject( error );
			} );
	} );
};

///// Output Handler /////
let payloadHandler = ( streamName, shardId, record ) => { // TODO: implemet replacing method.
	//console.dir( record.Data, { depth : null } );
	let dataBuffer = Buffer.from( record.Data, "base64" );
	let unzippedBuffer = zlib.unzipSync( dataBuffer );
	let textBuffer = unzippedBuffer.toString( "ascii" );
	console.log( textBuffer );
	//let jsonBuffer = JSON.parse( textBuffer );
	//console.dir( jsonBuffer, { depth : null } );	
}

let streamName = "test";
// Parameter reading
if( process.argv[2] ) { // TODO: improve parameter parsing ( after --stream-name string )
	streamName = process.argv[2];
}

/// Main Task ///
readStream( streamName );
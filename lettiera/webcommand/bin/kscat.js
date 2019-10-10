#! /usr/bin/env node
"use strict";

const Executor = require( "../lib/executor/executor" );

///// Functions /////
let readStream = ( streamName ) => {
    Executor.execute( `awslocal kinesis describe-stream --stream-name ${streamName}` )
        .then( ( streams ) => {
            let describeStream = JSON.parse( streams.stdout );
            let shards = describeStream.StreamDescription.Shards;
            let shradIds = [];
            for( let shard of shards ) {
                //shradIds.push( shard.ShardId );
                readShard( streamName, shard.ShardId ); // TODO: "await" ???
            }
        } )
        .catch( ( error ) => {
            console.error( error );
            process.exit( 255 );
        } );
};

let readShard = ( streamName, shardId ) => {
    Executor.execute( `awslocal kinesis get-shard-iterator --stream-name ${streamName} --shard-id ${shardId} --shard-iterator-type TRIM_HORIZON` )
        .then( ( streams ) => {
            let describeShardIterator = JSON.parse( streams.stdout );
            let shardIterator = describeShardIterator.ShardIterator;
            readRecords( streamName, shardId, shardIterator ); // TODO: "await" ???
        } )
        .catch( ( error ) => {
            console.error( error );
            process.exit( 255 );
        } );
};

let readRecords = ( streamName, shardId, shardIterator ) => {
    Executor.execute( `awslocal kinesis get-records --shard-iterator ${shardIterator}` )
        .then( ( streams ) => {
            let records = JSON.parse( streams.stdout );
            /*{
                "Records": [],
                "NextShardIterator": "AAAAAAAAAAF6i9k+9uSn9/HnvIdxnZRCxo256Q+CydkvEpqbtxBfgTq7Hwxbth+ES5tCzqTPztR2OCUfkRFjcL2hi9NWeTtUklMoaPtki2SYERmW/C8a37pApmAa2+ADl9TXAqP3GPPKNl30va3VKZCA/zOOGeY3AyTvpS1TEvJMWa0DnJ0IOO7F2rQvfSVZJKOi5l0DHHQ=",
                "MillisBehindLatest": 0
            }*/
            // TODO: while MillisBehindLatest????
            readRecords( streamName, shardId, records.NextShardIterator ); // TODO: "await" ???
        } )
        .catch( ( error ) => {
            console.error( error );
            process.exit( 255 );
        } );
};

let streamName = "test";
// Parameter reading
if( process.argv[1] ) {
    streamName = parseInt( process.argv[1] );
}

/// Main Task ///
readStream( streamName );
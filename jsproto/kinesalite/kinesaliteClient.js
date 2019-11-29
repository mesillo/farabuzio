"use strict";

const kinesisConfig = {
	region : "us-east-1",
	endpoint : "http://localhost:4567"
};

const defaultShardDataHandler = ( recordData ) => {
	console.dir(
		recordData,
		{ depth : null }
	);
};

const libConfigs = {
	checkCreationPollingTimer : 500,
	defaultBatchSize : 10,
	defaultIteratorType : "TRIM_HORIZON",
	defaultShardDataHandler : defaultShardDataHandler
};

const AWS = require( "aws-sdk" );

AWS.config = new AWS.Config( {
		accessKeyId : "AKID",
		secretAccessKey : "SECRET",
		region : "us-east-1"
} );

const timerPromise = ( millis ) => {
	return new Promise( ( resolve, reject ) => {
		setTimeout( resolve, millis );
	} );
};

class KinesaliteClient {
	constructor( endpoint = null ) {
		if( endpoint )
			kinesisConfig.endpoint = endpoint;
		this.kinesis = new AWS.Kinesis( kinesisConfig );
		this.streams = [];
	}

	createStream( streamName, shardCount = 1 ) {
		return new Promise( ( resolve, reject ) => {
			let streamInfos = {
				StreamName: streamName,
				ShardCount: shardCount
			};
			this.kinesis.createStream(
				streamInfos,
				( error, data ) => {
					if( error ) {
						reject( error )
					} else {
						this.streams.push( streamInfos );
						resolve( data );
					}
				}
			);
		} );
	}

	describeStream( streamName ) {
		return new Promise( ( resolve, reject ) => {
			this.kinesis.describeStream(
				{
					StreamName : streamName
				},
				( error, data ) => {
					if( error ) {
						reject( error )
					} else {
						resolve( data );
					}
				}
			);
		} );
	}

	waitForStream( streamName ) {
		return new Promise( async ( resolve, reject ) => {
			let creating = true;
			while( creating ) {
				creating = ( await this.describeStream( streamName ) ).StreamDescription.StreamStatus !== "ACTIVE" ? true : false;
				await timerPromise( libConfigs.checkCreationPollingTimer );
			}
			resolve();
		} );
	}

	writeStream( streamName, data, partitionKey ) {
		return new Promise( ( resolve, reject ) => {
			let recordParams = {
				Data : data,
				PartitionKey : partitionKey,
				StreamName : streamName
			};
			this.kinesis.putRecord(
				recordParams,
				( error, data ) => {
					if( error ) {
						reject( error )
					} else {
						resolve( data );
					}
				}
			);
		} );
	}

	readShardIterator( shardIterator, shardDataHandler ) {
		this.kinesis.getRecords(
			shardIterator,
			( error, data ) => {
				if( error ) {
					throw error;
				} else {
					shardDataHandler( data );
				}
			}
		);
	}

	readShard( streamName, shardDataHandler, shardId, batchSize, iteratorType ) {
		let shardInfos = {
			StreamName : streamName,
			ShardId : shardId,
			ShardIteratorType : iteratorType
		};
		this.kinesis.getShardIterator(
			shardInfos,
			( error, shardIteratorData ) => {
				if( error ) {
					throw error;
				} else {
					let shardReaderInfos = {
						ShardIterator : shardIteratorData.ShardIterator,
						Limit : batchSize
					};
					this.readShardIterator( shardReaderInfos, shardDataHandler );
				}
			}
		);
	}

	async readStream( streamName, shardDataHandler = libConfigs.defaultShardDataHandler, batchSize = libConfigs.defaultBatchSize, iteratorType = libConfigs.defaultIteratorType ) {
		let shards = ( await this.describeStream( streamName ) ).StreamDescription.Shards;
		//console.dir( shards );
		for( let shard of shards ) {
			this.readShard( streamName, shardDataHandler, shard.ShardId, batchSize, iteratorType );
		}
	}
}

module.exports = KinesaliteClient;
"use strict";

const KinesaliteClient = require( "./kinesaliteClient" );

class KinesaliteStreamClient {
	constructor( streamName, shardNum = null, client = null ) {
		this.client = this._getKinesisClient( client );
		this._setUpStream( streamName, shardNum );
		this.streamName = streamName;
	}

	async _setUpStream( streamName, shardCount ) {
		if( ! await this.client.streamExists( streamName ) ) { //TODO: check the shardCount.
			if( shardCount !== null ) {
				await this.client.createStream( streamName, shardCount );
			} else {
				await this.client.createStream( streamName );
			}
		}
		try {
			return await this.client.waitForStream( streamName );
		} catch( error ) {
			console.error( error );
			process.exit( 255 );
		}
	}

	_getKinesisClient( client ) {
		let returnValue = null;
		if( client !== null ) {
			switch( typeof client ) {
				case "string":
					returnValue = new KinesaliteClient( client );
					break;
				case "object":
				case "function":
					returnValue = client;
					break;
				default:
					throw new Error( "Invalid parameter client." ); //TODO: better log.
			}
		} else {
			returnValue = new KinesaliteClient();
		}
		return returnValue;
	}

	async describe() {
		return await this.client.describeStream( this.streamName );
	}

	writeStream( streamName, data, partitionKey ) {}

	async readStream( streamName, recordHandler = libConfigs.defaultRecordHandler, batchSize = libConfigs.batchSize, iteratorType = libConfigs.defaultIteratorType ) {}

	deleteStream( streamName ) {}
}

module.exports = KinesaliteStreamClient;
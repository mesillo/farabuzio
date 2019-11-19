"use strict";

const AWS = require( "aws-sdk" );

const baserecordParam =  JSON.stringify( {
	Data : null,
	PartitionKey : null,
	StreamName : "outputStream"
} );

const kinesisConfig = {
	region : "us-east-1"
};

const getRecorParam = ( params ) => {
	let returnValue = JSON.parse( baserecordParam );
	returnValue.Data = params.data;
	returnValue.PartitionKey = params.partitionKey;
};

let JSONEvent = async ( event, context ) => {
	let data = [];
	for( let record of event.Records ) {
		data.push( {
			data : Buffer.from( record.kinesis.data, "base64" ).toString( "ascii" ),
			partitionKey : record.kinesis.partitionKey
		} );
	}
	//console.dir( data, { depth : null } );
	for( let d of data ) {
		let recordParam = getRecorParam( d );
	}
	return 0;
};
//JSONEvent( {uno:1}, {due:2} ); //TODO: remove or comment
exports.handler = JSONEvent;
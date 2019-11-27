"use strict";

const AWS = require( "aws-sdk" );

const baserecordParam =  JSON.stringify( {
	Data : null,
	PartitionKey : null,
	StreamName : "outputStream"
} );

const kinesisConfig = {
	region: "papozze",
	endpoint: "http://localhost:4565", // 4565 = DEFAULT_PORT_KINESIS_BACKEND -> the internal kinesalite port i hope... i want to try to bypass localstack proxy for kinesis.
	//endpoint: "http://localhost:4568",
	accessKeyId:  "fakeAccessKeyId",
	secretAccessKey: "fakeSecretAccessKey",
	sessionToken: "fakeSessionToken"
};
const kinesis = new AWS.Kinesis( kinesisConfig );

const getRecorParam = ( params ) => {
	let returnValue = JSON.parse( baserecordParam );
	returnValue.Data = params.data;
	returnValue.PartitionKey = params.partitionKey;
	return returnValue;
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
	for( let i = 0; i < data.length; i++ ) {
		let d = data[ i ];
		let recordParams = getRecorParam( d );
		await new Promise( ( resolve, reject ) => {
			//console.dir( recordParams, { depth : null } );
			console.info( `Try to put record ${i+1}...` );
			kinesis.putRecord( recordParams, ( error, data ) => {
				if( error )
					reject( error );
				else
					resolve( data );
			} );
		} );
		console.info( `Writed record ${i+1} of ${data.length}!` );
	}
	return 0;
};
/////////////////////////////////////////////////////////////////////////////
const testEvent = {
	Records: [
		{
			kinesis: {
				partitionKey: 'partitionKey-03',
				kinesisSchemaVersion: '1.0',
				data: 'SGVsbG8sIHRoaXMgaXMgYSB0ZXN0IDEyMy4=',
				sequenceNumber: '49545115243490985018280067714973144582180062593244200961',
				approximateArrivalTimestamp: 1428537600
			},
			eventSource: 'aws:kinesis',
			eventID: 'shardId-000000000000:49545115243490985018280067714973144582180062593244200961',
			invokeIdentityArn: 'arn:aws:iam::EXAMPLE',
			eventVersion: '1.0',
			eventName: 'aws:kinesis:record',
			eventSourceARN: 'arn:aws:kinesis:EXAMPLE',
			awsRegion: 'eu-central-1'
		},
		{
			kinesis: {
				partitionKey: 'partitionKey-03',
				kinesisSchemaVersion: '1.0',
				data: 'SGVsbG8sIHRoaXMgaXMgYSB0ZXN0IDEyMy4=',
				sequenceNumber: '49545115243490985018280067714973144582180062593244200961',
				approximateArrivalTimestamp: 1428537600
			},
			eventSource: 'aws:kinesis',
			eventID: 'shardId-000000000000:49545115243490985018280067714973144582180062593244200961',
			invokeIdentityArn: 'arn:aws:iam::EXAMPLE',
			eventVersion: '1.0',
			eventName: 'aws:kinesis:record',
			eventSourceARN: 'arn:aws:kinesis:EXAMPLE',
			awsRegion: 'eu-central-1'
		},
		{
			kinesis: {
				partitionKey: 'partitionKey-03',
				kinesisSchemaVersion: '1.0',
				data: 'SGVsbG8sIHRoaXMgaXMgYSB0ZXN0IDEyMy4=',
				sequenceNumber: '49545115243490985018280067714973144582180062593244200961',
				approximateArrivalTimestamp: 1428537600
			},
			eventSource: 'aws:kinesis',
			eventID: 'shardId-000000000000:49545115243490985018280067714973144582180062593244200961',
			invokeIdentityArn: 'arn:aws:iam::EXAMPLE',
			eventVersion: '1.0',
			eventName: 'aws:kinesis:record',
			eventSourceARN: 'arn:aws:kinesis:EXAMPLE',
			awsRegion: 'eu-central-1'
		},
		{
			kinesis: {
				partitionKey: 'partitionKey-03',
				kinesisSchemaVersion: '1.0',
				data: 'SGVsbG8sIHRoaXMgaXMgYSB0ZXN0IDEyMy4=',
				sequenceNumber: '49545115243490985018280067714973144582180062593244200961',
				approximateArrivalTimestamp: 1428537600
			},
			eventSource: 'aws:kinesis',
			eventID: 'shardId-000000000000:49545115243490985018280067714973144582180062593244200961',
			invokeIdentityArn: 'arn:aws:iam::EXAMPLE',
			eventVersion: '1.0',
			eventName: 'aws:kinesis:record',
			eventSourceARN: 'arn:aws:kinesis:EXAMPLE',
			awsRegion: 'eu-central-1'
		},
		{
			kinesis: {
				partitionKey: 'partitionKey-03',
				kinesisSchemaVersion: '1.0',
				data: 'SGVsbG8sIHRoaXMgaXMgYSB0ZXN0IDEyMy4=',
				sequenceNumber: '49545115243490985018280067714973144582180062593244200961',
				approximateArrivalTimestamp: 1428537600
			},
			eventSource: 'aws:kinesis',
			eventID: 'shardId-000000000000:49545115243490985018280067714973144582180062593244200961',
			invokeIdentityArn: 'arn:aws:iam::EXAMPLE',
			eventVersion: '1.0',
			eventName: 'aws:kinesis:record',
			eventSourceARN: 'arn:aws:kinesis:EXAMPLE',
			awsRegion: 'eu-central-1'
		},
		{
			kinesis: {
				partitionKey: 'partitionKey-03',
				kinesisSchemaVersion: '1.0',
				data: 'SGVsbG8sIHRoaXMgaXMgYSB0ZXN0IDEyMy4=',
				sequenceNumber: '49545115243490985018280067714973144582180062593244200961',
				approximateArrivalTimestamp: 1428537600
			},
			eventSource: 'aws:kinesis',
			eventID: 'shardId-000000000000:49545115243490985018280067714973144582180062593244200961',
			invokeIdentityArn: 'arn:aws:iam::EXAMPLE',
			eventVersion: '1.0',
			eventName: 'aws:kinesis:record',
			eventSourceARN: 'arn:aws:kinesis:EXAMPLE',
			awsRegion: 'eu-central-1'
		},
		{
			kinesis: {
				partitionKey: 'partitionKey-03',
				kinesisSchemaVersion: '1.0',
				data: 'SGVsbG8sIHRoaXMgaXMgYSB0ZXN0IDEyMy4=',
				sequenceNumber: '49545115243490985018280067714973144582180062593244200961',
				approximateArrivalTimestamp: 1428537600
			},
			eventSource: 'aws:kinesis',
			eventID: 'shardId-000000000000:49545115243490985018280067714973144582180062593244200961',
			invokeIdentityArn: 'arn:aws:iam::EXAMPLE',
			eventVersion: '1.0',
			eventName: 'aws:kinesis:record',
			eventSourceARN: 'arn:aws:kinesis:EXAMPLE',
			awsRegion: 'eu-central-1'
		},
		{
			kinesis: {
				partitionKey: 'partitionKey-03',
				kinesisSchemaVersion: '1.0',
				data: 'SGVsbG8sIHRoaXMgaXMgYSB0ZXN0IDEyMy4=',
				sequenceNumber: '49545115243490985018280067714973144582180062593244200961',
				approximateArrivalTimestamp: 1428537600
			},
			eventSource: 'aws:kinesis',
			eventID: 'shardId-000000000000:49545115243490985018280067714973144582180062593244200961',
			invokeIdentityArn: 'arn:aws:iam::EXAMPLE',
			eventVersion: '1.0',
			eventName: 'aws:kinesis:record',
			eventSourceARN: 'arn:aws:kinesis:EXAMPLE',
			awsRegion: 'eu-central-1'
		},
		{
			kinesis: {
				partitionKey: 'partitionKey-03',
				kinesisSchemaVersion: '1.0',
				data: 'SGVsbG8sIHRoaXMgaXMgYSB0ZXN0IDEyMy4=',
				sequenceNumber: '49545115243490985018280067714973144582180062593244200961',
				approximateArrivalTimestamp: 1428537600
			},
			eventSource: 'aws:kinesis',
			eventID: 'shardId-000000000000:49545115243490985018280067714973144582180062593244200961',
			invokeIdentityArn: 'arn:aws:iam::EXAMPLE',
			eventVersion: '1.0',
			eventName: 'aws:kinesis:record',
			eventSourceARN: 'arn:aws:kinesis:EXAMPLE',
			awsRegion: 'eu-central-1'
		}
	]
};
const testContext = null;
//JSONEvent( testEvent, testContext ); //TODO: remove or comment
/////////////////////////////////////////////////////////////////////////////

exports.handler = JSONEvent;
"use strict"
/////////////
// Imports //
/////////////
const fs = require( "fs" );
const path = require( "path" );
const zlib = require( "zlib" );
////////////////////
// configurations //
////////////////////
let handlerFilename = "./lambdahandler.js";
let handlerFnName = "handler";
let inputFilename = "./inputs.json";
let zipPayload = true;
/////////////////
// Global Vars //
/////////////////
let baseEventStruct = {
	Records: []
};

let baseRecordStruct = {
	eventID: 'shardId-000000000000:49595160041073623401520312716573683571199835999744032770',
	eventSourceARN: 'arn:aws:kinesis:us-east-1:000000000000:stream/test-stream',
	kinesis: {
		partitionKey: '48748',
		data: 'eyJ2YWx1ZSI6IjE4ID0+IFJhbmQ6IDYifQ==',
		sequenceNumber: '49595160041073623401520312716573683571199835999744032770'
	}
};

let baseContextStruct = {}; // TODO: dump one and make a sensed example.
// setups

if( process.argv[ 2 ] !== undefined )
	handlerFilename = process.argv[ 2 ];
let targetDir = path.dirname( handlerFilename );
if( process.argv[ 3 ] !== undefined )
	targetDir = process.argv[ 3 ];

// local utilities... TODO: do it better...
let cloneObj = ( sourceObj ) => {
	return JSON.parse( JSON.stringify( sourceObj ) );
};
let compressPayload = ( payload ) => {
	return zlib.gzipSync( payload );
}
let donNoting = ( unmanagedInput ) => {
	return unmanagedInput;
}
// functions
let processResults = ( lambdaResult ) => {
	console.log( " ===== Process Result ===== " );
	//console.dir( lambdaResult, { depth: null } );
	console.log( lambdaResult.length + " elements." );
	console.log( " ========================== " );
};

// do things
let dataRaw = fs.readFileSync( inputFilename, "utf8" );
let dataLines = dataRaw.split( "\n" );

// manage lines...
let eventStruct = cloneObj( baseEventStruct );
for( const dataLine of dataLines ) {
	try {
		if( dataLine.length > 0 ) {
			//console.info( `Using dataline:\n\t\t ${dataLine}` );
			let record = cloneObj( baseRecordStruct );
			let recordBuffer = Buffer.from( dataLine );
			if( zipPayload ) {
				recordBuffer = compressPayload( recordBuffer );
			}
			let b64data = recordBuffer.toString( "base64" );
			record.kinesis.data = b64data;
			eventStruct.Records.push( record );
		}
	} catch( error ) {
		console.error( error ); //TODO: check the type...
	}
}
// cange Working Directory
process.chdir( targetDir );
console.log( process.cwd() );
let handler = require( handlerFilename )[ handlerFnName ];
console.info( "Try to run lambda..." );
try {
	let result = handler( eventStruct, baseContextStruct );
	if( result instanceof Promise ) {
		result.then( ( pResult ) => {
			processResults( pResult );
		} ).catch( ( error ) => {
			console.log( "========== Promise ERROR ==========" );
			console.error( error ); //TODO: check the type...		
		} );
	} else {
		processResults( result );
	}
} catch( error ) {
	console.log( "========== ERROR ==========" );
	console.error( error ); //TODO: check the type...
}

//process.exit();
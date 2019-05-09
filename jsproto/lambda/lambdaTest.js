"use strict"
// Imports
let fs = require( "fs" );
let path = require( "path" );
// definitios
let handlerFilename = "./lambdahandler.js";
let handlerFnName = "handler";

let inputFilename = "./inputs.json";

let baseEventStruct = {
	Records: [
		{
			eventID: 'shardId-000000000000:49595160041073623401520312716573683571199835999744032770',
			eventSourceARN: 'arn:aws:kinesis:us-east-1:000000000000:stream/test-stream',
			kinesis: {
				partitionKey: '48748',
				data: 'eyJ2YWx1ZSI6IjE4ID0+IFJhbmQ6IDYifQ==',
				sequenceNumber: '49595160041073623401520312716573683571199835999744032770'
			}
		}
	]
};

let baseContextStruct = {}; // TODO: dump one and make a sensed example.
// setups

if( process.argv[ 2 ] !== undefined )
	handlerFilename = process.argv[ 2 ];
let targetDir = path.dirname( handlerFilename );
if( process.argv[ 3 ] !== undefined )
	targetDir = process.argv[ 3 ];

let handler = require( handlerFilename )[ handlerFnName ];
// local utilities... TODO: do it better...
let cloneObj = ( sourceObj ) => {
	return JSON.parse( JSON.stringify( sourceObj ) );
};
// functions
let processResults = ( lambdaResult ) => {
	console.log( " ===== Process Result ===== " );
	console.dir( lambdaResult, { depth: null } );
	console.log( " ========================== " );
};

// do things
let dataRaw = fs.readFileSync( inputFilename, "utf8" );
let dataLines = dataRaw.split( "\n" );
// cange Working Directory
//let targetDir = path.dirname( handlerFilename );
process.chdir( targetDir );
//console.log( process.cwd() );
for( const dataLine of dataLines ) {
	try {
		//let data = JSON.parse( dataLine );
		if( dataLine.length > 0 ) {
			console.info( `Try with dataline:\n\t\t ${dataLine}` );
			let eventStruct = cloneObj( baseEventStruct );
			let b64data = Buffer.from( dataLine ).toString( "base64" );
			eventStruct.Records[0].kinesis.data = b64data;
			let result = handler( eventStruct, baseContextStruct );
			if( result instanceof Promise ) {
				result.then( ( pResult ) => {
					processResults( pResult );
				} );
			} else {
				processResults( result );
			}
		}
	} catch( error ) {
		console.error( error ); //TODO: check the type...
	}
}

//let result = handler( baseEventStruct, baseContextStruct );
//console.dir( result, { depth: null } );
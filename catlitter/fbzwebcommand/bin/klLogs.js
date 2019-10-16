#! /usr/bin/env node
"use strict";

const Executor = require( "../lib/executor/executor" );
const logPathPrefix = "/aws/lambda/"; // TODO: use "awslocal logs describe-log-groups --query logGroups[*].logGroupName" for chech names...

///// Functions /////
let readLogs = async ( functionName ) => {
	let logGroupName = logPathPrefix + functionName;
	return new Promise( ( resolve, reject ) => {
		Executor.execute( `awslocal logs describe-log-streams --log-group-name '${logGroupName}' --query logStreams[*].logStreamName` )
			.then( async ( streams ) => {
				let logPtrBatch = JSON.parse( streams.stdout );
				//console.log( logPtrBatch );
				for( let logPtr of logPtrBatch ) {
					await printLog( logGroupName, logPtr );
				}
				resolve();
			} )
			.catch( ( error ) => {
				console.error( error );
				reject( error );
			} );
	} );
};

let printLog = ( logGroupName, logPtr ) => {
	return new Promise( ( resolve, reject ) => {
		Executor.execute( `awslocal logs get-log-events --log-group-name '${logGroupName}' --log-stream-name '${logPtr}'` )
			.then( ( streams ) => {
				let logData = JSON.parse( streams.stdout );
				//let events = logData.events;
				//console.dir( events );
				for( let event of logData.events ) {
					console.log( event.timestamp +" :: " + event.message );
				}
				resolve();
			} )
			.catch( ( error ) => {
				console.error( error );
				reject( error );
			} );
	} );
};

let options = {
	functionName : "test"
};
// Parameter reading
for( let i = 0  ; i < process.argv.length ; i++ ) {
	switch( process.argv[ i ] ) {
		case "--function-name":
			options.functionName = process.argv[++i];
			break;
	}
}

/// Main Task ///
readLogs( options.functionName );
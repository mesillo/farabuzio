#! /usr/bin/env node
"use strict";

const Executor = require( "../lib/executor/executor" );

let configurations = {
	servicePrefix : "/aws/lambda/"
};

///// Functions /////
let checkResponse = ( logGroupName, streams ) => {
	let response = JSON.parse( streams.stdout );
	//let logGroups = response.logGroups; //TODO: understand why not...
	let logGroups = response;
	for( let logGroup of logGroups ) {
		//if( logGroup.logGroupName === logGroupName ) {//TODO: understand why not...
		if( logGroup === logGroupName ) { // TODO: probably it can be do better...
			return true;
		}
	}
	return false;
};

let checkLogGroup = ( config ) => {
	let logGroupName = configurations.servicePrefix + config.name;
	let getlogCommand = "awslocal logs describe-log-groups --query logGroups[*].logGroupName";
	let createLogGroupCommand = `awslocal logs create-log-group --log-group-name \"${logGroupName}\"`;
	Executor.execute( getlogCommand )
		.then( ( streams ) => {
			console.info( `Checking for ${logGroupName}...` );
			if( checkResponse( logGroupName, streams ) ) {
				console.info( "... found!" );
			} else {
				console.info( "... NOT found, try to create it..." );
				Executor.execute( createLogGroupCommand )
					.then( ( streams ) => {
						console.info( "... done!" ); //TODO: doing other actions???
					} )
					.catch( ( error ) => {
						console.error( error );
						process.exit( 255 ); //TODO: redefine...
					} );
			}
		} )
		.catch( ( error ) => {
			console.error( error );
			process.exit( 255 ); //TODO: redefine...
		} );
};

let options = {
	name : "testFn",
};
for( let i = 0  ; i < process.argv.length ; i++ ) {
	switch( process.argv[ i ] ) {
		case "--name":
			options.name = process.argv[++i];
			break;
	}
}

/// Main Task ///
checkLogGroup( options );

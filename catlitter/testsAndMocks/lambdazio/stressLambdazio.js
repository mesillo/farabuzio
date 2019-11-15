#! /usr/bin/env node
"use strict";

const http = require( "http" );

let lambdaNames = [ "banner", "echo", "exception", "wait" ];
let requestInterval = 50;
let stopTimeout = 60000;

let requestCounter = 0;
let totalRequestCounter = 0;

const baseObject = {
	lambda : "",
	event : {},
	context : {}
};
//let requestData = JSON.stringify( baseObject );
const options = {
	hostname: "localhost",
	port: 9999,
	path: "/",
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		//"Content-Length": requestData.length //TODO: setup content-length
	}
};

const debugEcho = ( data ) => {
	console.log( `${new Date()}:: ${data}` );
};

const print = ( data ) => {
	//process.stdout.write( data ); //TODO; console.log() ???????
	debugEcho( data.toString() );
};

const makeRequets = ( requestData ) => {
	const request = http.request( options, ( response ) => {
		debugEcho( `statusCode: ${response.statusCode}` );

		response.on( "data", ( data ) => {
			print( data );
		} );

		response.on( "end", () => { //TODO: is the rigth event???
			requestCounter--;
		} );
	});

	request.on( "error", ( error ) => {
		//console.error( error );
		debugEcho( error );
	} );

	request.write( requestData );
	request.end();
};

let index = 0;

let testTrigger = setInterval( () => {
	//debugEcho( lambdaNames[ index ] );
	baseObject.lambda = lambdaNames[ index ];
	index = (index + 1) % lambdaNames.length;
	let requestData = JSON.stringify( baseObject );
	requestCounter++;
	totalRequestCounter++;
	makeRequets( requestData );
}, requestInterval );

setTimeout( () => {
	clearInterval( testTrigger );
}, stopTimeout );

process.on( "exit", () => {
	debugEcho( "Unresolved requests: " + requestCounter + ":" + totalRequestCounter );
} );
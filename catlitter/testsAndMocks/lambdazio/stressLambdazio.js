#! /usr/bin/env node
"use strict";

const http = require( "http" );

let lambdaNames = [ "banner", "echo", "exception" ];
let requestInterval = 10;
let stopTimeout = 100000;

let requestCounter = 0;

const baseObject = {
	lambda : "",
	event : {},
	context : {}
};

let requestData = JSON.stringify( baseObject );

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

const print = ( data ) => {
	//process.stdout.write( data ); //TODO; console.log() ???????
	console.log( data.toString() );
};

const makeRequets = ( requestData ) => {
	const request = http.request( options, ( response ) => {
		console.log( `statusCode: ${response.statusCode}` );

		response.on( "data", ( data ) => {
			print( data );
		} );

		response.on( "end", () => { //TODO: is the rigth event???
			requestCounter--;
		} );
	});

	request.on( "error", ( error ) => {
		console.error( error );
	} );

	request.write( requestData );
	request.end();
};

let index = 0;

let testTrigger = setInterval( () => {
	//console.log( lambdaNames[ index ] );
	baseObject.lambda = lambdaNames[ index ];
	index = (index + 1) % lambdaNames.length;
	let requestData = JSON.stringify( baseObject );
	requestCounter++;
	makeRequets( requestData );
}, requestInterval );

setTimeout( () => {
	clearInterval( testTrigger );
}, stopTimeout );

process.on( "exit", () => {
	console.log( "Unresolved requests: " + requestCounter );
} );
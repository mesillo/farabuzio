#! /usr/bin/env node
"use strict";

const http = require( "https" );

const baseObject = {
	lambda : "",
	event : {},
	context : {}
};

let requestData = JSON.stringify( baseObject );

const options = {
	hostname: "localhost",
	port: 5555,
	path: "/",
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"Content-Length": requestData.length
	}
};

const print = ( data ) => {
	process.stdout.write( data ); //TODO; console.log() ???????
};

const request = http.request( options, ( response ) => {
	console.log( `statusCode: ${response.statusCode}` );

	response.on( "data", ( data ) => {
		print( data );
	} );
})

request.on( "error", ( error ) => {
	console.error( error );
} );

request.write( requestData );
request.end();

#! /usr/bin/env node
"use strict";

const http = require( "http" );

const server = http.createServer( ( request, response ) => {
	let message = "Request received!";
	response.writeHead( 200, { "Content-Type" : "text/plain" } );
	response.end( message );
} );

server.listen(
	5555,
	"127.0.0.1"
);
"use strict";

const http = require( "http" );
const lambdaServer = require( "./include/lib/lambdaserver" );
const RequestManager = require( "./include/lib/requestmanager" );

const RESPONSE_HEADER = { "Content-Type" : "text/plain" }; 

let port = 9999;
let lambdaSvr = new lambdaServer( "./fs/" );
let requestMnrg = async ( request, response ) => {
	let requestManager = new RequestManager( lambdaSvr );	
	await requestManager.manageRequets( request, response );
	response.writeHead(
		requestManager.getStatus(),
		RESPONSE_HEADER
	);
	response.end(
		requestManager.getMessage()
	);
	return;
}

let server = http.createServer( requestMnrg );

server.listen( port );
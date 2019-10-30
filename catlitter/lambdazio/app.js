"use strict";

const http = require( "http" );
const lambdaServer = require( "./include/lib/lambdaserver" );
const RequestManager = require( "./include/lib/requestmanager" );

let port = 9999;
let lambdaSvr = new lambdaServer( "./fs/" );
let requestManager = new RequestManager( lambdaSvr );

let requestMnrg = async ( request, response ) => {
	requestManager.manageRequets( request, response );
	response.end();
	return;
}

let server = http.createServer( requestMnrg );

server.listen( port );
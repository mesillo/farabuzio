"use strict";

const http = require( "http" );
const lambdaServer = require( "./include/lib/lambdaserver" );
const RequestManager = require( "./include/lib/requestmanager" );

const DEBUG = true;
const debug = ( str ) => { // Orrible debug function... :-(
	if( DEBUG )
		console.info( " === lambdazioSrv :: " + str );
};

const RESPONSE_HEADER = { "Content-Type" : "text/plain" };

let port = 9999;
let lambdaFs = "./fs/";
let lambdaSvr = new lambdaServer( lambdaFs );
let requestMnrg = async ( request, response ) => {
	let requestId = `${request.method}-${request.connection.remoteAddress}-${request.connection.remotePort}`;
	debug( `Start ${requestId}...` );
	//debug( `received a ${request.method} request from ${request.connection.remoteAddress} on port ${request.connection.remotePort}.` );
	//console.dir( request.connection.remotePort, { depth : null } );
	let requestManager = new RequestManager( lambdaSvr );	
	await requestManager.manageRequets( request, response );
	response.writeHead(
		requestManager.getStatus(),
		RESPONSE_HEADER
	);
	response.end(
		requestManager.getMessage()
	);
	debug( `... end ${requestId}.` );
	return;
}

let server = http.createServer( requestMnrg );

server.listen( port );
"use strict";

const http = require( "http" );

const lambdaServer = require( "./include/lib/lambdaserver" );

let port = 9999;
let lambdaName = "lambdaTest";
//let lambdaFile = "main";
let lambdaFile = "singletontest";
let lambdaHandler = "handler";

//let handler = require( `./fs/${lambdaName}/${lambdaFile}` )[ lambdaHandler ];

let lambdaSvr = new lambdaServer( "./fs/" );

let requestMnrg = async ( request, response ) => {
	/*console.dir(
		request.url,
		{ depth : null }
	);*/
	//await handler( "event", "context" );
	if( request.url === "/reset" ) {
		lambdaSvr = new lambdaServer( "./fs/" );
	}
	let lresult = await lambdaSvr.fireLambda( "lambdaTest", "event", "context" );
	response.end( lresult );
}

let server = http.createServer( requestMnrg );

server.listen( port );
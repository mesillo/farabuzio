"use strict";

const http = require( "http" );
const url = require( "url" );
const Commands = require( "./commands/commands" );
const Render = require( "./render/render" );
const Executor = require( "./executor/executor" );

const PORT = 8181;
const COMMANDURL = "/command";

let checkCommandRequest = ( request ) => {
	let parsedRequest = url.parse( request.url, true );
	if( parsedRequest.path === COMMANDURL ) { // found a command execution request...
		let requestParameters = parsedRequest.query;
	}
};

let manageRequest = ( request , response ) => {
	checkCommandRequest( request );
	//response.write( request.url ); //write a response to the client
	Render.setHeaders( response );
	Render.drawCommandForm( response );
	Render.drawSeparator( response );

	response.end(); //end the response
};

let server = http.createServer( manageRequest );

Executor.execute( "whoami" )
	.then( ( streams ) => {
		if( streams.stdour === "root\n" ) {
			console.error( "Not as Root!!!" );
			process.exit( 255 );
		}
		server.listen( PORT ); //the server object listens on port PORT
		console.log( "WebCommand listening on port " + PORT );
	} )
	.catch( ( error ) => {
		console.error( error );
		process.exit( 255 );
	} );

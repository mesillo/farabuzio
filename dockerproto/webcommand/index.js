"use strict";

const http = require( "http" );
const child_process = require( "child_process" );
const url = require( "url" );
const commands = require( "./commands/commands" );

const PORT = 8181;
const COMMANDURL = "/command";

const execute = ( command ) => {
	return new Promise( ( resolve, reject ) => {
		child_process.exec( command, ( error, stdour, stderr ) => {
			if( error ) {
				reject( error );
			}
			resolve( {
				stdout: stdour,
				stderr: stderr
			} );
		} );
	} );
};

let checkCommandRequest = ( request ) => {
	let parsedRequest = url.parse( request.url, true );
	if( parsedRequest.path === COMMANDURL ) { // found a command execution request...
		let requestParameters = parsedRequest.query;
	}
};

let manageRequest = ( request , response ) => {
	checkCommandRequest( request );
	response.write( request.url ); //write a response to the client
	response.end(); //end the response
};

let server = http.createServer( manageRequest );

execute( "whoami" )
	.then( ( streams ) => {
		//console.dir(
		//	streams,
		//	{ depth : null }
		//);
		if( streams.stdour === "root\n" ) {
			console.error( "Not as Root!!!" );
			process.exit( 255 );
		}
		server.listen( PORT ); //the server object listens on port PORT
		console.log( "WebComman listening on port " + PORT );
	} )
	.catch( ( error ) => {
		console.error( error );
		process.exit( 255 );
	} );

"use strict";

const http = require( "http" );
//const url = require( "url" );
//const Commands = require( "./commands/commands" );
const Render = require( "./render/render" );
const Executor = require( "./executor/executor" );
const RequestManager = require( "./requestmanager/requestmanager" );

const PORT = 8181;

let manageRequest = ( request, response ) => {
	Render.setHeaders( response );
	Render.drawCommandForm( response );
	Render.drawSeparator( response );
	RequestManager.commandManage( request, response );
	//response.end(); //end the response
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

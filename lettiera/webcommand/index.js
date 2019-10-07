"use strict";

const http = require( "http" );
const Render = require( "./render/render" );
const Executor = require( "./executor/executor" );
const RequestManager = require( "./requestmanager/requestmanager" );
const Uploader = require( "./uploader/uploader" );
const defines = require( "./defines" );

const PORT = 8181;

let manageRequest = async ( request, response ) => {
	let rsp = new Render( response );
	let upld = new Uploader( rsp );
	rsp.setHeaders();
	rsp.drawCommandForm();
	rsp.drawSeparator();
	await upld.manageUpload( request );
	await upld.listStorageFiles();	// TODO: evaluate to put in uploader... ???
	rsp.drawFileUploadForm();
	rsp.drawSeparator();
	await RequestManager.commandManage( request, response );
	rsp.close(); //response.end();
};

let server = http.createServer( manageRequest );

Executor.execute( "whoami" )
	.then( ( streams ) => {
		if( streams.stdout === "root\n" ) {
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

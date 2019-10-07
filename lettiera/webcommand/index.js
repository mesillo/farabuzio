"use strict";

const http = require( "http" );
const Render = require( "./render/render" );
const Executor = require( "./executor/executor" );
const RequestManager = require( "./requestmanager/requestmanager" );
const Uploader = require( "./uploader/uploader" );

const PORT = 8181;

let manageRequest = async ( request, response ) => {
	let rsp = new Render( response );
	let upld = new Uploader( rsp );
	//let reqMan = new RequestManager( rsp ); // TODO: use object...
	rsp.setHeaders();
	rsp.drawCommandForm();
	rsp.drawSeparator();
	await upld.manageUpload( request );
	await upld.listStorageFiles();
	rsp.drawFileUploadForm();
	rsp.drawSeparator();
	await RequestManager.commandManage( request, response ); // TODO: move from response to render...
	rsp.close();
};

let server = http.createServer( manageRequest );

Executor.execute( "whoami" )
	.then( ( streams ) => {
		if( streams.stdout === "root\n" ) {
			console.error( "Not as Root!!!" );
			process.exit( 255 );
		}
		server.listen( PORT );
		console.log( "WebCommand listening on port " + PORT );
	} )
	.catch( ( error ) => {
		console.error( error );
		process.exit( 255 );
	} );

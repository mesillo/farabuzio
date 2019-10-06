"use strict";

const http = require( "http" );
const Render = require( "./render/render" );
const Executor = require( "./executor/executor" );
const RequestManager = require( "./requestmanager/requestmanager" );
const Uploader = require( "./uploader/uploader" );
const defines = require( "./defines" );

const PORT = 8181;

let manageRequest = async ( request, response ) => {
	let render = new Render( response );
	render.setHeaders();
	render.drawCommandForm();
	render.drawSeparator();
	await Uploader.manageUpload( request );
	await listStorageFiles( response );
	render.drawFileUploadForm();
	render.drawSeparator();
	RequestManager.commandManage( request, response );
	//render.close();
};

let listStorageFiles = async ( response ) => { //TODO: return (something)???
	try {
		let streams = await Executor.execute( `ls -lh ${defines.STORAGEPATH}` )
		Render.drawText( streams.stdout, response );
	} catch( error ) {
		console.error( error );
		process.exit( 255 );
	}
}

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

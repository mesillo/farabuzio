"use strict";

const defines = require( "../defines" );
const formidable = require( "formidable" );
const Render = require( "../render/render" );
const Executor = require( "../executor/executor" );
const fs = require( "fs" );
const url = require( "url" );

class Uploader {
	/**
	 * The constructor
	 * @param {Render} render
	 */
	constructor( render ) {
		if( ! render || ! render.isOpen() ) {
			throw new Error( "Invalid Render provided!" );
		}
		this.render = render;
	}

	async manageUpload( request ) {
		await Uploader.manageUpload( request );
	}

	async listStorageFiles() {
		if( this.render.isOpen() ) {
			await Uploader.listStorageFiles( this.render );
		} else {
			console.warn( "Uploader: render is closed!" );
		}
	}

	///// Static Methods /////

	static async manageUpload( request ) {
		let parsedRequest = url.parse( request.url, true );
		if( parsedRequest.pathname === defines.UPLOADFILEURL ) { // found a upload request...
			await Uploader._manageUploadForm( request );
		}
		return;
	}

	static _manageUploadForm( request ) {
		let form = new formidable.IncomingForm();
		return new Promise( ( resolve, reject ) => {
			form.parse( request, ( error, fields, files ) => {
				let tempPath = files.filetoupload.path;
				let destPath = defines.STORAGEPATH + files.filetoupload.name;
				try {
					fs.renameSync( tempPath, destPath );
				} catch( error ) {
					console.error( error );
				}
				resolve();
			} );
		} );
	}

	static async listStorageFiles( render ) {
		try {
			let streams = await Executor.execute( `ls -lh ${defines.STORAGEPATH}` );
			render.drawText( streams.stdout );
		} catch( error ) {
			console.error( error );
			process.exit( 255 );
		}
	}
}

module.exports = Uploader;
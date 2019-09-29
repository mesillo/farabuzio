"use strict";

const defines = require( "../defines" );
const formidable = require( "formidable" );
const fs = require( "fs" );
const url = require( "url" );

class Uploader {
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
}

module.exports = Uploader;
"use strict";

const Commands = require( "../commands/commands" );
const defines = require( "../../defines" );
const statics = require( "../staticcontents/staticcontents" );

class Render {

	/**
	 * The constructor
	 * @param {ServerResponse} response 
	 */
	constructor( response ) {
		if( ! response ) {
			throw new Error( "No HTTP response provided!" );
		}
		this.response = response;
	}

	close() {
		if( this.isOpen() ) {
			this.response.end();
		}
		this.response = null;
	}

	/**
	 * Check if is possible for render to write.
	 * @returns {boolean}
	 */
	isOpen() {
		if( this.response !== null ) {
			return true;
		}
		return false;
	}

	/**
	 * check if response is utilizable
	 * @throws {Error}
	 */
	_checkResponse() {
		if( ! this.isOpen() ) {
			throw new Error( "Render not utilizable!" );
		}
	}

	/**
	 * draw the command selection form.
	 */
	drawCommandForm() {
		this._checkResponse();
		Render.drawCommandForm( this.response );
	}

	/**
	 * draw a separation.
	 */
	drawSeparator() {
		this._checkResponse();
		Render.drawSeparator( this.response );
	}

	/**
	 * Send headers to client.
	 * @param {number} status 
	 */
	setHeaders( status = 200 ) {
		this._checkResponse();
		Render.setHeaders( this.response, status );
	}

	drawForm( commandName ) {
		this._checkResponse();
		Render.drawForm( commandName, this.response );
	}

	drawCommandResponse( streams = null, cmdLine = null ) {
		this._checkResponse();
		Render.drawCommandResponse( this.response, streams, cmdLine );
	}

	drawText( text ) {
		this._checkResponse();
		Render.drawText( text, this.response );
	}

	drawError( error ) {
		this._checkResponse();
		Render.drawError( error, this.response );
	}

	drawFileUploadForm() {
		this._checkResponse();
		Render.drawFileUploadForm( this.response );
	}

	drawHtmlHeader() {
		this._checkResponse();
		Render.drawHtmlHeader( this.response );
	}

	drawHtmlFooter() {
		this._checkResponse();
		Render.drawHtmlFooter( this.response );
	}

	///// Static Methods /////

	/**
	 * draw the command selection form.
	 * @static
	 * @param {ServerResponse} response 
	 */
	static drawCommandForm( response ) {
		let cmdlist = Commands.getCommandsìList();
		let outputBuffer = `<form action="${defines.COMMANDURL}"><select name="${defines.FORMREQUSTEPARAM}">`;
		for( let cmdname of cmdlist ) {
			outputBuffer += `<option value="${cmdname}">${cmdname}</option>`;
		}
		outputBuffer += "</select><input type=\"submit\" value=\"Get Command Form\"></form>";
		response.write( outputBuffer );
	}

	/**
	 * draw a separation.
	 * @param {ServerResponse} response 
	 */
	static drawSeparator( response ) {
		response.write( "<hr>" );
	}

	/**
	 * Send headers to client.
	 * @static
	 * @param {ServerResponse} response 
	 * @param {number} status 
	 */
	static setHeaders( response, status = 200 ) {
		response.writeHead( status, { "Content-Type": "text/html"} );
	}

	static drawForm( commandName, response ) {
		let cmdDescription = Commands.getCommands()[ commandName ];
		if( cmdDescription ) {
			response.write( `<h3><center>${commandName}</center></h3>` );
			response.write( `<form action="${defines.EXECUTIONURL}">` );
			response.write( `<input type="hidden" name="${defines.EXECUTEREQUESTPARAM}" value="${commandName}">` );
			Render._drawInputs( cmdDescription, response );
			response.write( "</br><input type=\"submit\" value=\"Execute Command\"></form>" );
		} else {
			console.info( `Description for command ${cmdDescription} not found!` );
		}
	}

	static drawCommandResponse( response = null, streams = null, cmdLine = null ) {
		if( response ) {
			if( cmdLine ) {
				response.write( `<h3>${cmdLine}</h3>` );
			}
			if( streams ) {
				response.write( `stdout:<pre>${streams.stdout}</pre></br>` );
				response.write( `stderr:<pre>${streams.stderr}</pre></br>` );
			}
		}
	}

	static drawText( text, response ) {
		response.write( `\n<pre>\n${text}\n</pre>\n` );
	}

	static drawError( error, response ) {
		Render.drawText( error.message, response ); //TODO: imporve!
	}

	static drawFileUploadForm( response ) {
		response.write( `\n<form action="${defines.UPLOADFILEURL}" method="post" enctype="multipart/form-data">\n<input type="file" name="filetoupload"><br>\n<input type="submit" value=\"Upload\">\n</form>\n` );
	}

	static drawHtmlHeader( response ) {
		response.write(
			statics.getBuffer( "header" )
		);
	}

	static drawHtmlFooter( response ) {
		response.write(
			statics.getBuffer( "footer" )
		);
	}

	static _getInputList( cmdDescription ) {
		if( cmdDescription.parameters ) {
			return cmdDescription.parameters;
		} else {
			console.error( "Not yet implemented!" );
			return []; // return a void input list...
		}
	}

	static _drawInputs( cmdDescription, response ) {
		let inputList = Render._getInputList( cmdDescription );
		for( let input of inputList ) {
			response.write( `${input}: <input type="text" name="${input}"></br>` );
		}
	}
}

module.exports = Render;
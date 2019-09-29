"use strict";

const Commands = require( "../commands/commands" );
const defines = require( "../defines" );

class Render {
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
		outputBuffer += "</select><input type=\"submit\"></form>";
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
			response.write( `<form action="${defines.EXECUTIONURL}">` );
			response.write( `<input type="hidden" name="${defines.EXECUTEREQUESTPARAM}" value="${commandName}">` );
			Render._drawInputs( cmdDescription, response );
			response.write( "</br><input type=\"submit\"></form>" );
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

	static drawFileUploadForm( response ) {
		response.write( `\n<form action="${defines.UPLOADFILEURL}" method="post" enctype="multipart/form-data">\n<input type="file" name="filetoupload"><br>\n<input type="submit">\n</form>\n` );
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
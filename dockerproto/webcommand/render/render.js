"use strict";

const Commands = require( "../commands/commands" );

class Render {
	/**
	 * draw the command selection form.
	 * @static
	 * @param {ServerResponse} response 
	 */
	static drawCommandForm( response ) {
		let cmdlist = Commands.getCommandsìList();
		let outputBuffer = "<select>";
		for( let cmdname of cmdlist ) {
			outputBuffer += `<option value="${cmdname}">${cmdname}</option>`;
		}
		outputBuffer += "</select>";
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
}

module.exports = Render;
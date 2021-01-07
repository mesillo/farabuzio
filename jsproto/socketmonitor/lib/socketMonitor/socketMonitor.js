"use strict";

const child_process = require( "child_process" );

//const LSOF_COMMAND = "lsof -i tcp -n -P -F cpnT";
const LSOF_COMMAND = "lsof";

class SocketMonitor {
	constructor() {}

	getData() {
		child_process.exec( LSOF_COMMAND, ( error, stdout, stderr ) => {
			if( error ) {
				console.log( `error: ${error.message} `);
				return;
			}
			if( stderr ) {
				console.log( `stderr: ${stderr}` );
				return;
			}
			console.log( `stdout:\n ${stdout}\n\t===` );
		} );
	}
}

module.exports = SocketMonitor;
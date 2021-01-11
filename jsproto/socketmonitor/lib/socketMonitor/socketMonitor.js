"use strict";

const child_process = require( "child_process" );

const LSOF_COMMAND = "lsof -p PROCESSPID -n -P -F nT"; // -i seems not work with -p :-(

class SocketMonitor {
	constructor() {
		this.pid = process.pid;
		this.lsof_command = LSOF_COMMAND.replace( "PROCESSPID", this.pid );
	}

	_parseResult( rawResult ) {
		let lines = rawResult.split( "\n" );
		let stats = [];

		let sock = null;
		let state = null;
		let prefix = null;

		for( let line of lines ) {
			let s = line.slice( 0, 1 ); // first char
			line = line.slice( 1 );
	  
			switch( s ) {
				case "n": // socket description
					sock = line;
					break;
				case "T": // TCP/TPI info
					prefix = line.slice( 0, 2 ); // info type
					if( prefix === "ST" ) { // connection status
						state = line.slice( 3 );
						stats.push( {
							sock: sock,
							state: state
						} );
					}
					break;
			}
		};

		return stats;
	}

	_getPortFromSocketDescription( sockDesc ) {
		return sockDesc.split( "->" )[0].split( ":" )[1];
	}

	_countConnectionPerStatus( stats ) {
		let counts = {};

		for( let stat of stats ) {
			let port = this._getPortFromSocketDescription( stat.sock );
			if( counts[port] === undefined ) {
				counts[port] = {};
			}
			if( counts[port][stat.state] === undefined ) {
				counts[port][stat.state] = 1;
			} else {
				counts[port][stat.state]++;
			}
		}

		return counts;
	}

	getData( callback ) {
		child_process.exec(
			this.lsof_command, ( error, stdout, stderr ) => {
			if( error ) {
				throw error;
			}
			if( stderr ) {
				throw new Error( stderr );
			}
			let result = this._parseResult( stdout );
			let connectionCount = this._countConnectionPerStatus( result );
			callback( {
				pid: this.pid,
				count: result.length,
				stats: connectionCount
			} );
			//console.dir( this.countConnectionPerStatus( this.parseResult( stdout ) ) );
			//console.dir( this.parseResult( stdout ) );
			//console.log( "===============" );
		} );
	}
}

module.exports = SocketMonitor;
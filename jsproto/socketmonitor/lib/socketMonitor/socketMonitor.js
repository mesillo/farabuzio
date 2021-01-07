"use strict";

const child_process = require( "child_process" );

//const LSOF_COMMAND = "lsof -i tcp -n -P -F cpnT";
const LSOF_COMMAND = "lsof -i tcp:LISTENPORT -n -P -F cpnT";
//const LSOF_COMMAND = "lsof -R -i tcp:LISTENPORT -n -P -F cpnT";
//const LSOF_COMMAND = "lsof -p SERVERPID -i tcp -n -P -F cpnT";

class SocketMonitor {
	constructor( port ) {
		this.port = port;
	}

	parseResult( rawResult ) {
		let lines = rawResult.split( "\n" );
		let stats = [];

		let pid = 0;
		let cmd = null;
		let sock = null;
		let state = null;
		let prefix = null;

		for( let line of lines ) {
			let s = line.slice( 0, 1 ); // first char
			line = line.slice( 1 );
	  
			switch( s ) {
				case "p": // pid
					pid = line;
					break;
				case "c": // command
					cmd = line;
					break;
				case "n": // socket description
					sock = line;
					break;
				case "T": // TCP/TPI info
					prefix = line.slice( 0, 2 ); // info type
					if( prefix === "ST" ) { // connection status
						state = line.slice( 3 );
						stats.push( {
							pid: pid,
							cmd: cmd,
							sock: sock,
							state: state
						} );
					}
					break;
			}
		};

		return stats;
	}

	countConnectionPerStatus( stats ) {
		let counts = [];

		for( let stat of stats ) {
			if( counts[stat.state] === undefined ) {
				counts[stat.state] = 1;
			} else {
				counts[stat.state]++;
			}
		}

		return counts;
	}

	getData() {
		child_process.exec( LSOF_COMMAND.replace( "LISTENPORT", this.port ), ( error, stdout, stderr ) => {
			if( error ) {
				throw error;
			}
			if( stderr ) {
				throw new Error( stderr );
			}
			console.dir( this.countConnectionPerStatus( this.parseResult( stdout ) ) );
			//console.dir( this.parseResult( stdout ) );
		} );
	}
}

module.exports = SocketMonitor;
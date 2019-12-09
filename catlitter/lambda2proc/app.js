"use strict";

const configurations = require( "./etc/config.json" );
const L2P = require( "./includes/l2p/l2p" );

const runLambdaProcess = ( options ) => {
    let lambda = new L2P( options );
};

let options = {
	functionName : null,
	lambdasStorage : configurations.lambdasStorage
};
for( let i = 0  ; i < process.argv.length ; i++ ) {
	switch( process.argv[ i ] ) {
		case "--function-name":
			options.functionName = process.argv[++i];
			break;
	}
}
///// Main Task /////
runLambdaProcess( options );
#!/usr/bin/env node

let readline = require( "readline" );
let rl = readline.createInterface( {
	input: process.stdin,
	output: process.stdout,
	terminal: false
} );

rl.on( "line", ( line ) => {
	try {
		console.log( JSON.stringify( JSON.parse( line ) ) );
	} catch( error ) {
		return;
	}
} );

#!/usr/bin/env node

let dgram = require( "dgram" );
let readline = require( "readline" );
let rl = readline.createInterface( {
	input: process.stdin,
	output: process.stdout,
	terminal: false
} );

let client = dgram.createSocket( "udp4" );

rl.on( "line", ( line ) => {
	client.send( line, 0, line.length, 60000, "127.0.0.1" );
} );

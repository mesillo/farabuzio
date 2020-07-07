#!/usr/bin/env node

const dgram = require( "dgram" );
const zlib = require( "zlib" );
const readline = require( "readline" );

let rl = readline.createInterface( {
	input: process.stdin,
	output: process.stdout,
	terminal: false
} );

let client = dgram.createSocket( "udp4" );

let options = {
	hostname: "127.0.0.1",
	port: 60000,
	gzip: true
};

for( let i = 0  ; i < process.argv.length ; i++ ) {
	switch( process.argv[ i ] ) {
		case "--hostname":
			options.hostname = process.argv[++i];
			break;
		case "--port":
			options.port = parseInt( process.argv[++i] );
			break;
		case "--gzip":
			options.gzip = true;
			break;
		case "--nogzip":
			options.gzip = false;
			break;
	}
}

rl.on( "line", ( line ) => {
	let sendBuffer = Buffer.alloc( line.length + 3 );
	sendBuffer.writeInt8( 0x00, 0 );
	sendBuffer.writeInt8( 0x0B, 1 );
	sendBuffer.write( line, 2, line.length, "ascii" );
	sendBuffer.writeInt8( 0x0A, sendBuffer.length-1 );
	if( options.gzip ) {
		sendBuffer = zlib.gzipSync( sendBuffer );
	}

	client.send(
		sendBuffer,
		0,
		sendBuffer.length,
		options.port,
		options.hostname
	);
} );

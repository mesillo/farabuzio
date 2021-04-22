"use strict";

const net = require( "net" );
const fs = require( "fs" );

const HOST = "127.0.0.1";
//const HOST = "54.189.61.90";
const PORT = 1620;
const ACK_TIMEOUT = 3000;
const SENDING_INTERVAL = 3000;
const SENDER_NUM = 100;
//const SENDER_NUM = 50;
//const STATS_INTERVAL = 60000;
const STATS_INTERVAL = 30000;

const stats = {
	open: 0,
	closed: 0,
	acked: 0,
	timeouted: 0,
	errors: 0
};

let packets = [
	"000B00000B1A29F64B",
	"800208F3D31100006AD057E922AC0926B957EB9260DF",
	"84",
	"000B00000B1A29F64B1A440000D200",
	"033500000C076B5C208F01011E5268CEF20000196E3A3A0AEF3E934F3E2D780000000007000000005268CEFD0000196E3A3A0AEF3E934F3E2D780000000007000000005268CF080000196E3A3A0AEF3E934F3E2D780000000007000000005268CF130000196E3A3A0AEF3E934F3E2D780000000007000000005268CF1E0000196E3A3A0AEF3E934F3E2D780000000007000000005268CF290000196E3A3A0AEF3E934F3E2D780000000007000000005268CF340000196E3A3A0AEF3E934F3E2D780000000007000000005268CF3F0000196E3A3A0AEF3E934F3E2D780000000007000000005268CF4A0000196E3A3A0AEF3E934F3E2D780000000007000000005268CF550000196E3A3A0AEF3E934F3E2D780000000007000000005268CF600000196E3A3A0AEF3E934F3E2D780000000007000000005268CF6B0000196E3A3A0AEF3E934F3E2D780000000007000000005268CF730000196E36630AEF42CE4F6D0BF40400022208000000005268CF7E0000196E36B60AEF42BE4F6D0BF40000000007000000005268CF890000196E36B60AEF42BE4F6D0BF40000000007000000005268CF940000196E36B60AEF42BE4F6D0BF40000000007000000005268CF9F0000196E36B60AEF42BE4F6D0BF40000000007000000005268CFAA0000196E36B60AEF42BE4F6D0BF40000000007000000005268CFB50000196E36B60AEF42BE4F6D0BF40000000007000000005268CFC00000196E36B60AEF42BE4F6D0BF40000000007000000005268CFCB0000196E36B60AEF42BE4F6D0BF40000000007000000005268CFD60000196E36B60AEF42BE4F6D0BF40000000007000000005268CFD70000196E3C710AEF5EFF4F690BF40400011708000000005268CFE20000196E3B980AEF601A4F690BF40000000007000000005268CFED0000196E3B980AEF601A4F690BF40000000007000000005268CFF80000196E3B980AEF601A4F690BF40000000007000000005268D0030000196E3B980AEF601A4F690BF40000000007000000005268D00E0000196E3B980AEF601A4F690BF40000000007000000005268D0190000196E3B980AEF601A4F690BF40000000007000000005268D0240000196E3B980AEF601A4F690BF40000000007000000004600",
	"002B000315A07F44865A0F5072303374302E30322E34350000DFC29FF68CE40000601A000003E80000003C003CF142",
	"<rand>"
];

function* arrayIterator( elements ) {
	let index = 0;
	while( true ) {
		yield elements[ index ];
		index = ( index + 1 ) % elements.length;
	}
}

const destroyClient = ( timeout, client ) => {
	if( timeout != null ) {
		clearTimeout( timeout );
		timeout = null;
		client.destroy();
	}
};

const randomHex = () => {
	const MAX_BYTE_LEN = 20;
	const len = Math.floor( Math.random() * MAX_BYTE_LEN );
	const returnBuffer = Buffer.alloc( len );
	for( let i = 0 ; i < len ; i++ ) {
		returnBuffer[i] = Math.floor( Math.random() * 256 );
	}
	return returnBuffer.toString( "hex" );
};

const generateData = ( originData ) => {
	if( originData === "<rand>" ) {
		return randomHex();
	}
	return originData;
};

if( process.argv[ 2 ] !== undefined ) {
	let inputfile = process.argv[ 2 ];
	packets = JSON.parse( fs.readFileSync( inputfile ) );
}

const iterator = arrayIterator( packets );

for( let i = 0 ; i < SENDER_NUM ; i++ ) {
	//console.info( `Starting sender number: ${i}` );
	setInterval( () => {
		const client = new net.Socket();

		let timeout = null;
		client.connect( PORT, HOST, () => {
			stats.open++;
			let data = generateData( iterator.next().value );
			client.write(
				Buffer.from( data, "hex" )
			);

			timeout = setTimeout( () => {
				destroyClient( timeout, client );
				//console.info( "Timeout" );
				stats.timeouted++;
			}, ACK_TIMEOUT );
		});

		client.on( "data", ( data ) => {
			//console.log( "Received: " + data );
			stats.acked++;
			destroyClient( timeout, client );
		});

		client.on( "close", () => {
			//console.log( "Connection closed" );
			stats.closed++;
		});

		client.on( "error", ( error ) => {
			//console.error( error );
			stats.errors++;
		} );
	}, SENDING_INTERVAL );
}
console.info( "All sender started!" );

setInterval( () => {
	console.dir( stats );
	stats.open = 0;
	stats.closed = 0;
	stats.acked = 0;
	stats.timeouted = 0;
	stats.errors = 0;
}, STATS_INTERVAL );
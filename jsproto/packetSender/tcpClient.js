"use strict";

const net = require( "net" );
const fs = require( "fs" );

const HOST = "127.0.0.1";
const PORT = 1620;
const ACK_TIMEOUT = 1000;
const SENDING_INTERVAL = 3000;
const SENDER_NUM = 5;
const STATS_INTERVAL = 6000;

let packets = [
	"000B00000B1A29F64B",
	"800208F3D31100006AD057E922AC0926B957EB9260DF",
	"84",
	"000B00000B1A29F64B1A440000D200",
	"033500000C076B5C208F01011E5268CEF20000196E3A3A0AEF3E934F3E2D780000000007000000005268CEFD0000196E3A3A0AEF3E934F3E2D780000000007000000005268CF080000196E3A3A0AEF3E934F3E2D780000000007000000005268CF130000196E3A3A0AEF3E934F3E2D780000000007000000005268CF1E0000196E3A3A0AEF3E934F3E2D780000000007000000005268CF290000196E3A3A0AEF3E934F3E2D780000000007000000005268CF340000196E3A3A0AEF3E934F3E2D780000000007000000005268CF3F0000196E3A3A0AEF3E934F3E2D780000000007000000005268CF4A0000196E3A3A0AEF3E934F3E2D780000000007000000005268CF550000196E3A3A0AEF3E934F3E2D780000000007000000005268CF600000196E3A3A0AEF3E934F3E2D780000000007000000005268CF6B0000196E3A3A0AEF3E934F3E2D780000000007000000005268CF730000196E36630AEF42CE4F6D0BF40400022208000000005268CF7E0000196E36B60AEF42BE4F6D0BF40000000007000000005268CF890000196E36B60AEF42BE4F6D0BF40000000007000000005268CF940000196E36B60AEF42BE4F6D0BF40000000007000000005268CF9F0000196E36B60AEF42BE4F6D0BF40000000007000000005268CFAA0000196E36B60AEF42BE4F6D0BF40000000007000000005268CFB50000196E36B60AEF42BE4F6D0BF40000000007000000005268CFC00000196E36B60AEF42BE4F6D0BF40000000007000000005268CFCB0000196E36B60AEF42BE4F6D0BF40000000007000000005268CFD60000196E36B60AEF42BE4F6D0BF40000000007000000005268CFD70000196E3C710AEF5EFF4F690BF40400011708000000005268CFE20000196E3B980AEF601A4F690BF40000000007000000005268CFED0000196E3B980AEF601A4F690BF40000000007000000005268CFF80000196E3B980AEF601A4F690BF40000000007000000005268D0030000196E3B980AEF601A4F690BF40000000007000000005268D00E0000196E3B980AEF601A4F690BF40000000007000000005268D0190000196E3B980AEF601A4F690BF40000000007000000005268D0240000196E3B980AEF601A4F690BF40000000007000000004600",
	"002B000315A07F44865A0F5072303374302E30322E34350000DFC29FF68CE40000601A000003E80000003C003CF142",
	"<rand>",
	"0205797035939081570302017A030904030101071105031105030000250000000000000000000058C385D65F4853511C07F0DFDD2C0C17115D441A912F42D68343F1664A2C6C22CB397295E69F44C822B33458F51024183DF8E64BBD0B3D44540AE28B453E186881103E6C8212E443A5811495CE1D8DF53D77E7CEB3EDEE2884AB7DF8F1BDBFF3FB9D5B5501511E11794B3F77F03FCBCB1A95E3EF1A1DA6047EB6F199FF5E5C37F401579C85B50491F93DFE1DDFF0CF93056B4ECFCF000D3C71D2DD671A353C22CAF6B71B2C5F975FBE37F481C8BF954814A1D0CC86BABE97E6987B314023F001E1631F0D7DCFFE387BCC211D3A5024D5F7D03C2B5C241A86AFC1F7ABF0AB11438FA0FE7DD33B1D7952FD10EA17A3FE7BE1D92EDE4751D35B79B83F1A37F4B3F0E74DAF391C69F99758BDF0BC7E592C9108C15F840FD8F8A094A754E457F96A9A32FB1311798EA0FEA998A187E15B72D4774AF95DF061F4FF017CA38DF7091F917C23F28C16C4996E7A87D399E10F8AFC965FDF30F4A7A8DF64E343F48555C09F84EF14CFEB851F820FDAD68FB280C8532AEAD721FF0AF21CB3F17EF80A293F3F2F95F709BF6F3B9987D73FF7DBD0BF234F4FB23F9A96D6CFE43CB8B7779EF739FC1A7CAF8DE7F55DD23CF03C9E3F497FD3B63E9FE7643FFBC5F90EC147E1BB93F93547C6BE144AFDE7FDFC043F03DF65E3797F2CDF29F2ACC04FC177DA789FD8C7CDAD9DFEA4FBF4FC7E916744AAFF0BFE5D0E1FC2F39688F3EA17F963F06FD3FCCEBE57C31763DFC7A5F98F677939CF746A1EAC3CFFE0DFC05FB1F5D1D43E5AE7ABF2D59867B7749FF03CAEBF863E01DF61EBE7597EC67D7201FE257C9B621EC6A5F9B904FF2A87AF447E77866F56780FCDB2D319FB725991C78BE7AD97F67175573F6B7AEB7E5B806F55783F8D9979E4FC2AEFC3F95AF33328F2DC837F01DF6A3B6FB3ECB8F0D679F529F3CF9BFB1B91DE2F7DCA3C4BA9FDB2F2F728FADF21CED7DA17FEBEEB55F816E4AFCDB8FF6F293C3FAF32B1BF567E95E7F35F22CD3FCF7F47D99F39338F3CFF2A5F89E7AD90E67F41F4E7F58EA7F4F9FCC19AA5790865D7A7F4FE4C9B79ACE73D037F5D51FF046DB2B0E4799E6EE1DB6D7C90BEB22A293FEFE755F8D11CBE05FD69831F96FC35F8B11CDE8FFEF0F37A28EE43DEFF1B4A3F61CEF3B8747FAA7C10FD6992E6D925E62797F7D2A4B98FFCFD3828FE3FC3EF13E9BEA5CCF75D9F745E3C4F7B9697EF737E9F50EA7D67EFE5FB73D29C07793EDB77C9532BFA5923F6AB4BE183A8CFFBF34DDADFFFE61B5C86"
];

if( process.argv[ 2 ] !== undefined ) {
	let inputfile = process.argv[ 2 ];
	packets = JSON.parse( fs.readFileSync( inputfile ) );
}
/////////////////////////////////////////////////////////////////
function* arrayIterator( elements ) { // TODO: Put in the class definition.
	let index = 0;
	while( true ) {
		yield elements[ index ];
		index = ( index + 1 ) % elements.length;
	}
}
class ArrayIterator {
	constructor( elements ) {
		this.iterator = arrayIterator( elements );
	}

	next() {
		return this.iterator.next();
	}

	nextValue() {
		return this.next().value;
	}
}

class DataGenerator {
	static MAX_BYTE_LEN = 20;

	constructor( data ) {
		if( typeof data === "object" && data.constructor.name === "ArrayIterator" ) {
			this.iterator = data;
		} else if( Array.isArray( data ) ) {
			this.iterator = new ArrayIterator( data );
		} else {
			throw new Error( `Unable to initialize with a ${typeof data}.` );
		}
	}

	nextValue() {
		return DataGenerator.generateData( this.iterator.nextValue() );
	}

	static randomHex() {
		const len = Math.floor( Math.random() * this.MAX_BYTE_LEN );
		const returnBuffer = Buffer.alloc( len );
		for( let i = 0 ; i < len ; i++ ) {
			returnBuffer[i] = Math.floor( Math.random() * 256 );
		}
		return returnBuffer.toString( "hex" );
	};
	
	static generateData( originData ) {
		if( originData === "<rand>" ) {
			return DataGenerator.randomHex();
		}
		return originData;
	};
}
/////////////////////////////////////////////////////////////////

//========================================================================================//
class TcpClient {
	constructor( dataGenerator, senderNumber, sendingInterval, ackTimeout, host, port ) {
		this.dataGenerator = dataGenerator;
		this.senderNumber = senderNumber;
		this.sendingInterval = sendingInterval;
		this.ackTimeout = ackTimeout;
		this.host = host;
		this.port = port;

		this._senders = [];

		this._statsInit();
	}

	start() {
		for( let i = 0 ; i < this.senderNumber ; i++ ) {
			//console.info( `Starting sender number: ${i}` );
			this._senders.push(
				setInterval( ( port, host, generator, ackTimeout, stats ) => {
					const client = new net.Socket();

					let timeout = null;
					client.connect( port, host, () => {
						stats.open++;
						//let data = generateData( iterator.next().value );
						let data = generator.nextValue();
						client.write(
							Buffer.from( data, "hex" )
						);

						timeout = setTimeout( () => {
							TcpClient.destroyClient( timeout, client );
							//console.info( "Timeout" );
							stats.timeouted++;
						}, ackTimeout );
					});

					client.on( "data", ( data ) => {
						//console.log( "Received: " + data );
						stats.acked++;
						TcpClient.destroyClient( timeout, client );
					});

					client.on( "close", () => {
						//console.log( "Connection closed" );
						stats.closed++;
					});

					client.on( "error", ( error ) => {
						//console.error( error );
						stats.errors++;
					} );
				}, this.sendingInterval,
				this.port, this.host, this.dataGenerator, this.ackTimeout, this._stats )
			);
		}
		//console.info( "All sender started!" );
		return this._senders.length;	
	}

	stop() {} // TODO: ... to do...

	_statsReset() {
		this._stats.open = 0;
		this._stats.closed = 0;
		this._stats.acked = 0;
		this._stats.timeouted = 0;
		this._stats.errors = 0;
	}

	_statsInit() {
		this._stats = {
			open: 0,
			closed: 0,
			acked: 0,
			timeouted: 0,
			errors: 0
		};
	}

	getStats() {
		const returnValue = JSON.parse( JSON.stringify( this._stats ) );
		this._statsReset();
		return returnValue;
	}

	static destroyClient( timeout, client ) {
		if( timeout != null ) {
			clearTimeout( timeout );
			timeout = null;
			client.destroy();
		}
	};
}
//========================================================================================//

const generator = new DataGenerator( packets );
const client = new TcpClient(
	generator,
	SENDER_NUM,
	SENDING_INTERVAL,
	ACK_TIMEOUT,
	HOST,
	PORT
);

setInterval( () => {
	console.dir(
		client.getStats()
	);
}, STATS_INTERVAL );

const clientNum = client.start();
console.log( `Started ${clientNum} clients!` );

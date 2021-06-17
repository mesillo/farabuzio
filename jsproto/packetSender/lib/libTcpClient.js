"use strict";

const net = require( "net" );
const DataGenerator = require( "./dataGenerator" );

class TcpClient {
	constructor( dataGenerator, senderNumber, sendingInterval, ackTimeout, host, port ) {
		this.dataGenerator = this._getDatagenerator( dataGenerator );
		this.senderNumber = senderNumber;
		this.sendingInterval = sendingInterval;
		this.ackTimeout = ackTimeout;
		this.host = host;
		this.port = port;

		this._senders = [];

		this._statsInit();
	}

	_getDatagenerator( dataGenerator ) {
		if( typeof dataGenerator === "object" && dataGenerator.constructor.name === "DataGenerator" ) {
			return dataGenerator;
		}
		if( Array.isArray( dataGenerator ) ) {
			return new DataGenerator( dataGenerator );
		}
		throw new Error( `Unable to initialize TcpClient with a ${typeof data}.` );
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

	stop() {
		for( let sender of this._senders ) {
			clearInterval( sender );
		}
		this._senders = [];
	} // TODO: ... to do...

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

module.exports = TcpClient;
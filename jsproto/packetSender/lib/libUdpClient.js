"use strict";

const udp = require( "dgram" );
const DataGenerator = require( "./dataGenerator" );

class UdpClient {
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
				setInterval( ( port, host, ackTimeout, generator, stats ) => {
					const client = udp.createSocket( "udp4" );
			
					let timer = null;
			
					client.on( "message", ( data, infos ) => {
						//console.log( "Received: " + data );
						if( timer ) {
							clearTimeout( timer );
							timer = null;
							stats.acked++;

							client.close(); // TEST
						}
					});
			
					//client.on( "close", () => { // TODO: ??? called on close() invocation.
					//	//console.log( "=== Connection closed ===" );
					//	//stats.closed++;
					//} );
			
					client.on( "error", ( error ) => {  // TODO: ???
						//console.error( "=== Error ===" );
						//console.error( error );
						stats.errors++;
						// client.close(); // TEST
					} );
			
					let data = generator.nextValue();
					client.send( Buffer.from( data, "hex" ), port, host, ( error ) => {
						if( error ) {
							//console.error( "=== send error ===" );
							client.close();
						} else {
							//console.log( "Data sent: " + data );
							stats.sended++;
							timer = setTimeout( () => {
								//console.log( "=== got timeout ===" );
								timer = null;
								stats.timeouted++;

								client.close(); // TEST
							}, ackTimeout );
						}
					} );
				}, this.sendingInterval,
				this.port, this.host, this.ackTimeout, this.dataGenerator, this._stats )
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
		this._stats.sended = 0;
		this._stats.acked = 0;
		this._stats.timeouted = 0;
		this._stats.errors = 0;
	}

	_statsInit() {
		this._stats = {
			sended: 0,
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
}

module.exports = UdpClient;
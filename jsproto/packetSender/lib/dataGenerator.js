"use strict";

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

module.exports = DataGenerator;
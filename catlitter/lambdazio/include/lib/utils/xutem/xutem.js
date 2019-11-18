"use strict";
/**
 * Simple Mutex implementation.
 * CREDITS
 * Based on:
 * https://github.com/DirtyHairy/async-mutex
 */
class Xutem {
	constructor() {
		this._releaseQueue = [];
		this._pending = false;
	}

	async acquire() {
		let ticket = new Promise( ( release ) => {
			this._releaseQueue.push( release );
		} );
	
		if( ! this._pending )
			this._releaseNext();

		return ticket;
	}

	_releaseNext() {
		if( this._releaseQueue.length === 0 ) {
			this._pending = false;
		} else {
			this._pending = true;
			//( this._releaseQueue.shift() )( this._releaseNext.bind( this ) );
			let currentTocken = this._releaseQueue.shift();
			let nextTockenTrigger = this._releaseNext.bind( this );
			currentTocken( nextTockenTrigger );
		}
	}
}

module.exports = Xutem;
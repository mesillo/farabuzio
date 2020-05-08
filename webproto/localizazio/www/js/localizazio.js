"use strict";

const DEFAULT_OPTIONS = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

class Position {
	constructor( options = null ) {
		this.lastPosition = {
			position: null,
			date: new Date()
		}
		this.monitoringId = null;
		if( options !== null ) {
			this.options = options;
		} else {
			this.options = DEFAULT_OPTIONS;
		}
	}

	static positionHandler(  ) {
		console.log( "=== positionHandler ===" );
		console.dir( arguments[0] );
	}

	static positionErrorHandler(  ) {
		console.log( "=== positionErrorHandler ===" );
		console.dir( arguments[0] );
	}

	startPositionMonitoring() {
		this.monitoringId = navigator.geolocation.watchPosition(
			Position.positionHandler,
			Position.positionErrorHandler,
			this.options
		);
	}

	stopPositionMonitoring() {
		if( this.monitoringId !== null ) {
			navigator.geolocation.clearWatch( this.monitoringId );
			this.monitoringId = null;
		}
	}

	getPosition() {
		return new Promise( ( resolve, reject ) => {
			navigator.geolocation.getCurrentPosition(
				resolve,
				reject,
				this.options
			);
		} );
	}
}
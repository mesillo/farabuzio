"use strict";

const dns = require( "dns" );

const testName = "visirun.com";

dns.lookup( testName, ( error, result ) => {
	if( error ) {
		console.error( error );
	}
	console.dir( result );
} );
"use strict";

const http = require( "http" );

const applicatication = http.createServer( ( request, response ) => {
	console.log( `Request "${request.url}" ...` );
	//console.dir( request.url );
	response.write( "mocked-response" );
	response.end();
	console.log( "... served!" );
} );

applicatication.listen( 80 );
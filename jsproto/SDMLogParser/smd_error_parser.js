"use strict";

if( process.argv[2] === undefined ) {
	console.error( "No data." );
	process.exit( 1 );
}

try{
	const data = JSON.parse( process.argv[2] );
}catch( error ) {
	console.error( "Not valid JSON data." );
	process.exit( 2 );
}

console.log( "ThingType: " + args.instance.Header.ThingType );
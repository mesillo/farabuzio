#!/usr/bin/env node

"use strict";

const fs = require( "fs" );

const filename = process.argv[2];

if( filename === undefined ) {
	console.error( "no file to dump" );
}


const readStream = fs.createReadStream(
	filename,
	{ highWaterMark: 16 }
);

const data = [];

readStream.on( "data", ( chunk ) => {
	data.push( chunk );
} );

readStream.on( "end", () => {
	console.log(
		Buffer.concat( data ).toString( "hex" )
	);
} );

readStream.on( "error", ( error ) => {
	console.log( error );
} );
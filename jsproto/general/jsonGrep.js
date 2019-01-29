#!/usr/bin/env node

"use strict"

let readline = require( "readline" );

let rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

if( process.argv[ 2 ] !== undefined )
    fieldName = process.argv[ 2 ];

rl.on( "line", ( line ) => {
    let data = JSON.parse( line );
    if( data.hasOwnProperty( fieldName ) )
        rl.write( line );
} );

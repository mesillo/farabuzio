#!/usr/bin/env node

"use strict";

const crypto = require( "crypto" );

let readline = require( "readline" );
let rl = readline.createInterface( {
	input: process.stdin,
	output: process.stdout,
	terminal: false
} );

let conunter = 0;
let db = {};

const checkString = ( input ) => {
	if( typeof input === "string" && input.length > 0 ) {
		let hash = crypto.createHash( "md5" ).update( input ).digest( "hex" );
		hash = hash.toString(); //Sometimes it is not a string... TODO: why???
		db[ hash ] = ( db[ hash ] !== undefined ) ? ++( db[ hash ] ) : 1;
	}
};

const printResults = ( db ) => {
	let dupCounter = 0;
	let uniCounter = 0;
	let totCounter = 0;
	console.log( "========================================================================" );
	for( let index in db ) {
		if( db[index] > 1 ) {
			console.log( `${index} => ${db[index]}` );
			dupCounter++;
		} else {
			uniCounter++;
		}
		totCounter++;
	}
	console.log( "========================================================================" );
	console.log( `Duplicates: ${dupCounter} | Uniques: ${uniCounter} | Total: ${totCounter}` );
	console.log( "========================================================================" );
};

rl.on( "line", function( line ) {
	//console.log(line);
	checkString( line );
	conunter++;
} );

process.on( "SIGINT", () => {
	//console.log( "=== HIT ===" );
	//console.log( conunter );
	//console.dir( db );
	printResults( db );
	process.exit( 0 );
} );

process.on( "exit", () => {
	//console.log( "=== HIT ===" );
	printResults( db );
} );
#!/usr/bin/env node

"use strict";

const elasticsearch = require( "elasticsearch" );
const readline = require( "readline" );

let options = {
	indexName: "test_index"
};

let client = new elasticsearch.Client( {
	host: "localhost:9200",
	log: "trace"
} );

let rl = readline.createInterface( {
  input: process.stdin,
  output: process.stdout,
  terminal: false
} );

rl.on( "line", async ( line ) => {
	await client.index( {
		type: "_doc",
		index: options.indexName,
		body: {
			stdin : line
		}
	} );
} );

// Parameter reading
for( let i = 0  ; i < process.argv.length ; i++ ) {
	switch( process.argv[ i ] ) {
		case "--index-name":
			options.indexName = process.argv[++i];
			break;
	}
}
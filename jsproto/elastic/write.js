#!/usr/bin/env node

"use strict";
const elasticsearch = require( "@elastic/elasticsearch" );
const readline = require( "readline" );

let options = {
	indexName: "test_index"
};

let client = new elasticsearch.Client( {
	//host: "localhost:9200",
	node: "http://localhost:9200",
	//log: "trace"
} );

let rl = readline.createInterface( {
  input: process.stdin,
  output: process.stdout,
  terminal: false
} );

rl.on( "line", async ( line ) => {
	//await client.index( {
	//	//type: "_doc", // Uncomment for 6up version...
	//	index: options.indexName,
	//	body: {
	//		stdin : line
	//	}
	//} );
	await client.index( {
		index: options.indexName,
		type: "doc", // uncomment this line if you are using {es} ≤ 6
		body: {
			body : line
		}
	} );
	console.dir( ( await client.search( {
		index: options.indexName,
		//type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
		body: {
			query: {
				//match: { stdin : line }
			}
		}
	} ) )[ "body" ].hits.hits,
	{ depth : null } );
} );

// Parameter reading
for( let i = 0  ; i < process.argv.length ; i++ ) {
	switch( process.argv[ i ] ) {
		case "--index-name":
			options.indexName = process.argv[++i];
			break;
	}
}

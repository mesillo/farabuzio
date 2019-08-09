"use strict"

const http = require( "http" );

let url = "http://localhost:1234";
let times = 5;

let agent = new http.Agent({
	keepAlive: true,
	maxSockets: 200
});

for( let i = 0 ; i < times ; i++ ) {
	http.get(
		url,
		{
			agent: agent
		},
		( response ) => {
			response.on( "data", ( chunk ) => { console.log( chunk ) } );
			response.on( "end", () => { console.log( "=== END ===" ) } );
		}
	);
}

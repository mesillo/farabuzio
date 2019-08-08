"use strict"

const http = require( "http" );
/*console.dir(
	https.get,
	{depth:null}
)*/

let url = "http://localhost:1234";
let times = 100;

let agent = new http.Agent({
	keepAlive: true,
	maxSockets: 1
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

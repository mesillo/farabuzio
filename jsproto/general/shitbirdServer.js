#!/usr/bin/env node

let httpPort = 8080;

const http = require( "http" );
const util = require( "util" );

let standardResponse = {
	"results": [
	  {
		"address_components": [
		  {
			"long_name": "277",
			"short_name": "277",
			"types": [
			  "street_number"
			]
		  },
		  {
			"long_name": "Bedford Avenue",
			"short_name": "Bedford Ave",
			"types": [
			  "route"
			]
		  },
		  {
			"long_name": "Williamsburg",
			"short_name": "Williamsburg",
			"types": [
			  "neighborhood",
			  "political"
			]
		  },
		  {
			"long_name": "Brooklyn",
			"short_name": "Brooklyn",
			"types": [
			  "sublocality",
			  "political"
			]
		  },
		  {
			"long_name": "Kings",
			"short_name": "Kings",
			"types": [
			  "<script>console.log(\"malicius code\")</script>administrative_area_level_2",
			  "political"
			]
		  },
		  {
			"long_name": "New York",
			"short_name": "NY",
			"types": [
			  "administrative_area_level_1",
			  "political"
			]
		  },
		  {
			"long_name": "United States",
			"short_name": "US",
			"types": [
			  "country",
			  "political"
			]
		  },
		  {
			"long_name": "11211",
			"short_name": "11211",
			"types": [
			  "postal_code"
			]
		  }
		],
		"formatted_address": "277 Bedford Avenue, Brooklyn, NY 11211, USA",
		"geometry": {
		  "location": {
			"lat": 40.714232,
			"lng": -73.9612889
		  },
		  "location_type": "ROOFTOP",
		  "viewport": {
			"northeast": {
			  "lat": 40.7155809802915,
			  "lng": -73.9599399197085
			},
			"southwest": {
			  "lat": 40.7128830197085,
			  "lng": -73.96263788029151
			}
		  }
		},
		"place_id": "ChIJd8BlQ2BZwokRAFUEcm_qrcA",
		"types": [
		  "street_address"
		]
	  }
	],
	"status": "OK"
  };

// vedere : https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/

let server = http.createServer( ( request, response ) => {
	console.log( " ============================== " );
	//console.log( util.inspect( request ) );
	//console.dir( request );
	console.dir( request.method );
	console.dir( request.url );
	console.dir( request.headers );
	console.log( " ============================== " );
	//response.write( '{"results":[{"address_components":[{"long_name":"277","short_name":"277","types":["street_number"]},{"long_name":"Bedford Avenue","short_name":"Bedford Ave","types":["route"]},{"long_name":"Williamsburg","short_name":"Williamsburg","types":["neighborhood","political"]},{"long_name":"Brooklyn","short_name":"Brooklyn","types":["sublocality","political"]},{"long_name":"Kings","short_name":"Kings","types":["administrative_area_level_2","political"]},{"long_name":"New York","short_name":"NY","types":["administrative_area_level_1","political"]},{"long_name":"United States","short_name":"US","types":["country","political"]},{"long_name":"11211","short_name":"11211","types":["postal_code"]}],"formatted_address":"277 Bedford Avenue, Brooklyn, NY 11211, USA","geometry":{"location":{"lat":40.714232,"lng":-73.9612889},"location_type":"ROOFTOP","viewport":{"northeast":{"lat":40.7155809802915,"lng":-73.9599399197085},"southwest":{"lat":40.7128830197085,"lng":-73.96263788029151}}},"place_id":"ChIJd8BlQ2BZwokRAFUEcm_qrcA","types":["street_address"]}],"status":"OK"}' );

	response.write( JSON.stringify( standardResponse ) );

	//response.writeHead( 200, { "Content-Type": "text/plain" } );
	//response.write( JSON.stringify( {
	//	"results" : [],
	//	"status" : "STOCAZZO_ERROR"
	//} ) );
	response.end();
} );

server.listen( httpPort );
console.log( "port => " + httpPort );
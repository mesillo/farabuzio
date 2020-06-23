"use strict";

const http = require( "https" );

let user = "tiger@test.com";
let passwd = "tiger.test";

let endpoint = "fsdapi.test.us.fm-cloud.com";
let path = "/mobile/v1/auth/token";

//let correlationId = "926181b7-9102-4278-8638-6b40f88c6d7e";
let correlationId = "uuid-a-caso";

let authString = Buffer.from( `${user}:${passwd}` ).toString( "base64" );

let outBuffer = ""; 

let postOptions = {
	host: endpoint,
	path: path,
	method: "POST",
	headers: {
		"Correlation-Id": correlationId,
		//"accept": "*/*",
		"accept": "application/json",
		"Authorization": `Basic ${authString}`
	}
};

let postRequest = http.request( postOptions, ( response ) => {
	response.on( "data", ( chunk ) => {
		outBuffer += chunk;
	} );

	response.on( "end", () => {
		//console.dir( JSON.parse( outBuffer ) );
		console.log( JSON.parse( outBuffer ).token );
	} );
} );
postRequest.end();
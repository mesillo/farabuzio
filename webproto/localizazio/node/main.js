"use strict";

//const webServer = require( "https" );
const webServer = require( "http" );
const fs = require( "fs" );

class Application {
	//static router( request, response ) {}
}

webServer.createServer( (req, res) => {
	console.log( req.url );
	if( req.url === "/" ) {
		req.url = "/html/index.html";
	}
	fs.readFile( __dirname + "/../www/" + req.url, ( err, data ) =>  {
		if( err ) {
			res.writeHead( 404 );
			res.end( JSON.stringify( err ) );
			return;
		}
		res.writeHead( 200 );
		res.end( data );
	} );
} ).listen( 8080 );
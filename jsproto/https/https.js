"use strict";

const https = require( "https" );

//const applicatication = https.createServer( {}, ( request, response ) => {
const applicatication = https.createServer( ( request, response ) => {
    console.log( "Request..." );
    response.write( "<h3> Done! </h3>" );
    response.end();
    console.log( "... served!" );
} );

applicatication.listen( 443 );
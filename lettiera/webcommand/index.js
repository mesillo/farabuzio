"use strict";

const WebCommandServer = require( "./lib/webcommand" );
const defines = require( "./defines" );

let port = defines.SERVERPORT;
// Parameter reading
if( process.argv[2] ) {
    port = parseInt( process.argv[2] );
}

let server = new WebCommandServer( port );

server.run();

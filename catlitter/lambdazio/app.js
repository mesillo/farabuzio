"use strict";

const http = require( "http" );

let port = 9999;

let requestMnrg = ( request, response ) => {
    console.dir(
        request,
        { depth : null }
    );
    response.end();
}

let server = http.createServer( requestMnrg );

server.listen( port );
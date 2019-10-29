"use strict";

const http = require( "http" );

let port = 9999;
let lambdaName = "lambdaTest";
//let lambdaFile = "main";
let lambdaFile = "singletontest";
let lambdaHandler = "handler";

let handler = require( `./fs/${lambdaName}/${lambdaFile}` )[ lambdaHandler ];

let requestMnrg = async ( request, response ) => {
    //console.dir(
    //    request,
    //    { depth : null }
    //);
    await handler( "event", "context" );
    response.end();
}

let server = http.createServer( requestMnrg );

server.listen( port );
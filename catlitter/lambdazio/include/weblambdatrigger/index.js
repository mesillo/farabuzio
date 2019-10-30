"use strict";

const http = require( "http" );

class WebLambdaTrigger {
    constructor( lambdaSvr ) {
        this.lambdaSvr = lambdaSvr;
        this.httpServer = http.createServer( this.manageRequest );
    }

    async manageRequest ( request, response ) {
        console.dir( this.lambdaSvr );
        //let lresult = await this.lambdaSvr.fireLambda( "lambdaTest", "event", "context" );
        //response.write( lresult );
    }

    listen( port ) {
        this.httpServer.listen( port );
    }
}

module.exports = WebLambdaTrigger;
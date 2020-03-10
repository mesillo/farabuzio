"use strict";

let TockenValidator = require( "./lib/tokenValidator" );

const endpoint = {
    protocol: "https",
    hostname: "token.stsv4.50faeb5394d2.dev.us.fm-cloud.com",
    port: 443
};

let tv = new TockenValidator( endpoint );

tv.getJwksUri()
    .then( result => {
        console.dir(
            result,
            { depth : null }
        );
} );

//tv.getOpenidConfiguration()
//    .then( result => {
//        console.dir(
//            result,
//            { depth : null }
//        );
//} );
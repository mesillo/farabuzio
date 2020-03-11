"use strict";

let TockenValidator = require( "./lib/tokenValidator" );

const endpoint = {
    protocol: "https",
    hostname: "token.stsv4.50faeb5394d2.dev.us.fm-cloud.com",
    //hostname: "demo.identityserver.io",
    port: 443
};

//const JWT = "eyJ0eXAiOiJqd3QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImcwYzBCekw1b19HU3pmRUJDTTZXU0hsNGdfaGx0Q3g0dmlaem5WNkkzeXMifQ";
const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lMiIsImlhdCI6MTU1MDU4MTA4NH0.WN5D-BFLypnuklvO3VFQ5ucDjBT68R2Yc-gj8AlkRAs";

let tv = new TockenValidator( endpoint );

tv.verifyJWTToken( JWT )
    .then( result => {
        console.dir(
            result,
            { depth : null }
        );
} );

//tv.getJWKSKeyStore()
//    .then( result => {
//        console.dir(
//            result,
//            { depth : null }
//        );
//} );

//tv.getJwksUri()
//    .then( result => {
//        console.dir(
//            result,
//            { depth : null }
//        );
//} );

//tv.getOpenidConfiguration()
//    .then( result => {
//        console.dir(
//            result,
//            { depth : null }
//        );
//} );
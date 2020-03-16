"use strict";

const fs = require( "fs" );

let TockenValidator = require( "./lib/tokenValidator" );
let WsReceiver = require( "./lib/wsServer" );

const stsTokenEndpoint = {
	protocol: "https",
	//hostname: "token.stsv4.50faeb5394d2.dev.us.fm-cloud.com",
	hostname: "token.stsv4.50a6863366c5.eu.fm-cloud.com",
	//hostname: "demo.identityserver.io",
	port: 443
};
const verificationOptions = {
    issuer : stsTokenEndpoint.protocol + "://" + stsTokenEndpoint.hostname,
    audience: [
        "https://token.stsv4.50a6863366c5.eu.fm-cloud.com/resources",
        "openid",
        "profile",
        "reveal"
    ]
};

let tockenValidator = new TockenValidator( stsTokenEndpoint );
tockenValidator.setValidationOptions( verificationOptions );
const WSoptions = {
	port: 8080,
	protocol: "https",
	httpsOptions: {
		cert: fs.readFileSync( "./keys/cert.pem" ),
		key: fs.readFileSync( "./keys/key.pem" ) // or Buffers... :-|
	},
	tokenValidator: tockenValidator
};

let wsReceiver = new WsReceiver( WSoptions );

wsReceiver.run();

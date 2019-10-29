"use strict";

const fileSystemDir = "../../../fs/";
const fs = require( "fs" ).promises;

const defaultConfigurations = {
	lambdaName : "lambdaTest",
	lambdaFile : "main",
	lambdaHandler : "handler",
	httpPort : 9000,
	processTimeToLive : null //Not used for the moment...
}

class LambdaServer {
	/*constructor( configuration = defaultConfigurations ) {
		// TODO: checks and Exceptions management...
		this.handler = require( fileSystemDir + configuration.lambdaName + "/" + configuration.lambdaFile )[ configuration.lambdaHandler ];
	}*/
	constructor( lambdaStorage = null ) {
		if( ! lambdaStorage ) {
			fs.lstat( lambdaStorage )
		}
	}
}

module.exports = LambdaServer;
"use strict";

const fileSystemDir = "../../../fs/";

const defaultConfigurations = {
    lambdaName : "lambdaTest",
    lambdaFile : "main",
    lambdaHandler : "handler",
    httpPort : 9000,
    processTimeToLive : null //Not used for the moment...
}

class LambdaServer {
    constructor( configuration = defaultConfigurations ) {
        // TODO: checks and Exceptions management...
        this.handler = require( fileSystemDir + configuration.lambdaName + "/" + configuration.lambdaFile )[ configuration.lambdaHandler ];
    }

    /* fire( event, contest ) {
        this.handler( event, contest );
    } */
}

module.exports = LambdaServer;
"use strict";

const fileSystemDir = "../../../fs/";
const fs = require( "fs" );
const path = require( "path" );

const defaultConfigurations = {
	lambdaName : "lambdaTest",
	lambdaFile : "main",
	lambdaHandler : "handler",
	httpPort : 9000,
	processTimeToLive : null //Not used for the moment...
}

class LambdaServer {
	constructor( lambdaStorage = null ) {
		this.lambdaHandlers = [];
		if( lambdaStorage && fs.lstatSync( lambdaStorage ).isDirectory() ) {
			this._scanDirectory( lambdaStorage );
		}
		//console.dir( this.lambdaHandlers );
	}

	_scanDirectory( lambdaStorage ) {
		let files = fs.readdirSync( lambdaStorage );
		for( let file of files ) {
			let testPath = `${lambdaStorage}/${file}`;
			if( fs.lstatSync( testPath ).isDirectory() ) {
				this._tryToDesribeLambda( testPath );
			}
		}
	}

	_tryToDesribeLambda( testPath ) {
		let files = fs.readdirSync( testPath );
		for( let file of files ) {
			if( file === "lambda.json" ) {
				//let configData = JSON.parse( fs.readFileSync( testPath + "/lambda.json" ) );
				let relativePath = path.relative( __dirname, testPath );
				let configData = require( relativePath + "/lambda.json" );
				this._addConfiguration( relativePath, configData );
			}
		}
	}

	_addConfiguration( relativePath, configData ) {
		// TODO: log informations.
		this.lambdaHandlers[ configData.lambdaName ] = require( relativePath +"/"+ configData.lambdaFile )[ configData.lambdaHandler ];
	}

	async fireLambda( lambdaName, event, context ) {
		if( this.lambdaHandlers[ lambdaName ] ) {
			// TODO: checks on event and context.. ??
			// TODO: use call() or other method to change the context of call???
			return await this.lambdaHandlers[ lambdaName ]( event, context );
		}// else TODO: log something???
		return null;
	}

	getLambdaList() {
		return Object.keys( this.lambdaHandlers );
	}
}

module.exports = LambdaServer;
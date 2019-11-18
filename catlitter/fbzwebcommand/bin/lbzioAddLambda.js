#! /usr/bin/env node
"use strict";

const Executor = require( "../lib/executor/executor" );
const fs = require( "fs" );

let configurations = {
	lambdazioFs : "../lambdazio/fs/",
	lambdazioConfigFile : "lambda.json"
};

///// Functions /////
let createFs = ( config ) => {
	return new Promise( ( resolve, reject ) => {
		let destDir = `${config.lbziofs}/${config.functionName}`;
		let unzipCommand = `unzip -qq ${config.zipName} -d ${destDir}`;
		let mkdirCommand = `mkdir ${destDir}`;	
		console.info( `Creating ${destDir}.` );
		Executor.execute( mkdirCommand )
			.then( async ( streams ) => {
				console.info( `Unzip ${config.zipName}.` );
				Executor.execute( unzipCommand )
					.then( async ( streams ) => {
						await createConfigJOSN( config, destDir );
						console.info( "Done!" );
						resolve();
					} )
					.catch( ( error ) => {
						console.error( error );
						process.exit( 255 ); //TODO: redefine...
					} );
			} )
			.catch( ( error ) => {
				console.error( error );
				process.exit( 255 ); //TODO: redefine...
			} );
	} );
};

let createConfigJOSN = async ( config, destDir ) => {
	let configFile = `${destDir}/${configurations.lambdazioConfigFile}`;
	console.info( `Creating config file ${configFile}.` );
	let configContent = JSON.stringify( {
		lambdaFile : config.filename,
		lambdaHandler : config.handler,
		lambdaName : config.functionName
	} );
	fs.writeFileSync( configFile, configContent );
	return;
};

let addLambdaDirectory = async ( options ) => {
	if( options.zipName ) {
		if( ! options.lbziofs ) {
			options.lbziofs = configurations.lambdazioFs;
		}
		// TODO: checks on zip file...
		// TODO: checks on function name...
		await createFs( options );
	}// else {
	//	TODO: print error message...
	//}
};

let options = {
	zipName : null,
	lbziofs : null,
	filename : "index",
	handler : "handler",
	functionName : "zipFn"
};
for( let i = 0  ; i < process.argv.length ; i++ ) {
	switch( process.argv[ i ] ) {
		case "--zip-file":
			options.zipName = process.argv[++i];
			break;
		case "--lbzio-fs":
			options.lbziofs = process.argv[++i];
			break;
		case "--filename":
			options.filename = process.argv[++i];
			break;
		case "--handler":
			options.handler = process.argv[++i];
			break;
		case "--name":
			options.functionName = process.argv[++i];
			break;
	}
}

/// Main Task ///
addLambdaDirectory( options );
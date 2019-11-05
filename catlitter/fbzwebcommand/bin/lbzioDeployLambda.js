#! /usr/bin/env node
"use strict";

const Executor = require( "../lib/executor/executor" );
const fs = require( "fs" );

let configurations = {
	tempDirectory : "./temp/"
};

///// Functions /////
let createTempFile = ( config ) => {
	let handlerName = "LH" + ( Math.abs( Math.round( Math.random() * 1000000 ) ) );
	//let filename = config.tempDirectory +"/"+ handlerName + ".py";
	//let filename = config.tempDirectory +"/"+ handlerName + ".py";
	let filename = handlerName + ".py";
	//let zipFilename = config.tempDirectory +"/"+ handlerName + ".zip";
	let zipFilename = handlerName + ".zip";
	let template = __dirname + "/lib/templates/handler.py";
	let replaceCommand = `cat ${template} | sed 's/=lambda=name=placeholder=/${config.functionName}/g' > ${config.tempDirectory}/${filename}`;
	let zipCommand = `cd ${config.tempDirectory} && zip -q ${zipFilename} ${filename} && rm ${filename} && cd -`;
	let deployLambdaCommand = `awslocal lambda create-function --function-name=${config.functionName} --handler=${handlerName}.hendler --runtime=python2.7 --region=fakeRegion --role=fakeRole --zip-file fileb://${config.tempDirectory}/${zipFilename}`; //TODO: check the runtime (python3???)...
	//console.log( deployLambdaCommand );
	//let removeCommand = `rm ${filename}`; //TODO: enable after tests...
	Executor.execute( replaceCommand )
		.then( async ( streams ) => {
			console.log( `Created handler for ${config.functionName} function in ${filename}...` );
			Executor.execute( zipCommand )
				.then( async ( streams ) => {
					console.log( `Zipped py file in ${zipFilename}` );
					Executor.execute( deployLambdaCommand )
						.then( ( streams ) => {
							console.log( `Lambda Function ${config.functionName} deployed!` );
							//TODO: remove lambda handler after deploy...
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
		} )
		.catch( ( error ) => {
			console.error( error );
			process.exit( 255 ); //TODO: redefine...
		} );
};

let deployPythonLambda = ( config ) => {
	if( ! config.tempDirectory ) {
		config.tempDirectory = configurations.tempDirectory;
	}
	createTempFile( config );
};

let options = {
	functionName : "zipFn",
	tempDirectory : null
};
for( let i = 0  ; i < process.argv.length ; i++ ) {
	switch( process.argv[ i ] ) {
		case "--name":
			options.functionName = process.argv[++i];
			break;
		case "--temp-dir":
			options.tempDirectory = process.argv[++i];
			break;
	}
}

/// Main Task ///
deployPythonLambda( options );
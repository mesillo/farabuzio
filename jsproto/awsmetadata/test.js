const AWS = require( "aws-sdk" );
//const promisify = require( "util" ).promisify;

const doTest = async () => {
	const options = {
		httpOptions: {
			timeout: 10000
		}
	};
	const metadataService = new AWS.MetadataService( options );
	//const metadataService = new AWS.MetadataService();
	//const requestAsync = promisify( metadataService.request );
	const requestAsync = async ( requestParam ) => {
		return new Promise( ( resolve, reject ) => {
			metadataService.request( requestParam, ( error, data ) => {
				if( error ) {
					reject( error );
				}
				resolve( data );
			} );
		} );
	};
	try {
		const startRequestTime = process.hrtime();
		const response = await requestAsync("/latest/meta-data/instance-id");
		const endRequestTime = process.hrtime( startRequestTime );
		console.log( `HealthCheck instance-id request completed in: ${endRequestTime[0]}sec + ${endRequestTime[1] / 1000000}ms` );
		console.dir( response );
	} catch( error ) {
		console.error( "=== ERROR ===" );
		console.error( error );
	}
};

const metadataService = new AWS.MetadataService();
//metadataService.request( "/latest/meta-data/instance-id", ( error, data ) => {
//	if( error ) {
//		console.error( error );
//	}
//	console.log( data );
//} );

//const metadataService = new AWS.MetadataService( {
//	httpOptions: {
//		timeout: 10000
//	},
//	host: "127.0.0.1"
//} );
//const asyncRequest = metadataService.request( "/latest/meta-data/instance-id" ).Promise;
//asyncRequest.then( ( data ) => {
//	console.log( data );
//} ).catch( ( error ) => {
//	console.error( error );
//} );

//metadataService.request( "/latest/meta-data/instance-id", ( error, data ) => {
metadataService.request( "/latest/meta-data/", ( error, data ) => {
	if( error ) {
		console.error( error );
	}
	//console.log( data );
	console.dir(
		data,
		{ depth: null }
	)
} );

//doTest();

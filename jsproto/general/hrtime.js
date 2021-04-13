"use strict";

const testFn = ( ms ) => {
	return new Promise( ( resolve, reject ) => {
		setTimeout( () => {
			resolve();
		}, ms );
	} );
};

const startRequestTime = process.hrtime();
console.log( "A IO request to measure." );
testFn( 2000 ).then( () => {
	const endRequestTime = process.hrtime( startRequestTime );
	console.dir( endRequestTime );
	console.log( `${endRequestTime[0]}sec + ${endRequestTime[1] / 1000000}ms` );
} );

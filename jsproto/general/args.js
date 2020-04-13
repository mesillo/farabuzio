"use strict";

const testFn = ( ... args ) => {
	console.log( "========================================" );
	console.dir( args );
};

testFn();
testFn( 1 );
testFn( 1, {pippo:2} );
testFn( 1, {pippo:2}, "tree" );
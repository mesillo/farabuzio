#!/usr/bin/env node

let util = require( "util" );
let readline = require( "readline" );
let rl = readline.createInterface( {
  input: process.stdin,
  output: process.stdout,
  terminal: false
} );

rl.on( "line", function( line ) {
    let object = JSON.parse( line );
    //console.log( object );
    //console.log( util.inspect( object, {showHidden: false, depth: null} ) );
    console.log( util.inspect( object, false, null, true /* enable colors */) );
} );

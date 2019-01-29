#!/usr/bin/env node

let readline = require( "readline" );
let rl = readline.createInterface( {
  input: process.stdin,
  output: process.stdout,
  terminal: false
} );

rl.on( "line", function( line ) {
    console.log(line);
} );

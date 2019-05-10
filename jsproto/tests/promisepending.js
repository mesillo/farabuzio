"use strict"

let promises = [];



/*************************************************
for( let i = 0 ; i < 10 ; i++ ) {
    promises.push( new Promise( ( resolve, reject ) => {
        setTimeout( () => {
            resolve( i );
        }, i * 100 );
    } ) );
}

Promise.all( promises ).then( ( results ) => {
    console.dir( results, { depth: null } );
} );
*/

/*************************************************
let p = new Promise( ( resolve, reject ) => {
    console.log( "Initialized..." );
} );
console.dir( p, { depth: null } );
console.log( "END" );
*/
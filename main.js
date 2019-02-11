//console.log( process.env );

console.log( "PID : " + process.pid );
setTimeout( () => {
    throw new Error( " Some stupid error! :-|" );
}, 3000 );

//process.exit( 0 );

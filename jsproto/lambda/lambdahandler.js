"use strict"

let unzipSync = require( "zlib" ).unzipSync;

console.log('Loading function');

let parseAndDisplay = async ( event, context ) => {
    //console.log(JSON.stringify(event, null, 2));
    event.Records.forEach(function(record) {
        // Kinesis data is base64 encoded so decode here
        let payload = new Buffer(record.kinesis.data, 'base64');//.toString('ascii');
        try{
            payload = unzipSync( payload );
        } catch( error ) {
            console.info( "Not compressed payload." );
        }
        payload = payload.toString();
        console.log('Decoded payload:', payload);
        console.log( "Decoded payload type:", typeof payload );
    });
    return event.Records.length;
};

let dirEvent = async ( event, context ) => {
    console.dir(
        event,
        {
            depth: null
        }
    );
    return 0;
};

let JSONEvent = async ( event, context ) => {
    console.log( JSON.stringify( event ) );
    return 0;
};
exports.handler = JSONEvent;
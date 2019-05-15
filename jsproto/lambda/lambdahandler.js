"use strict"

let unzipSync = require( "zlib" ).unzipSync;

console.log('Loading function');

exports.handler = async function(event, context) {
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
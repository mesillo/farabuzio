"use strict"

let JSONEvent = async ( event, context ) => {
    console.log( JSON.stringify( event ) );
    return 0;
};
exports.handler = JSONEvent;

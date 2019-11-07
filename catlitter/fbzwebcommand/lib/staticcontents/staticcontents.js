"use strict";

const defines = require( "../../defines" );
const fs = require( "fs" );

class StaticContents {
    ///// Static Methods /////
    static getBuffer( filename = null ) {
        let returnString = "";
        try {
            returnString = fs.readFileSync( defines.STATICCONTENTS + filename ).toString();
        } catch( error ) {
            console.error( error );
        }
        return returnString;
    }
}

module.exports = StaticContents;
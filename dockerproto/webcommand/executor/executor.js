"use strict";

const child_process = require( "child_process" );

class Executor {
    static execute( command ) {
        return new Promise( ( resolve, reject ) => {
            child_process.exec( command, ( error, stdour, stderr ) => {
                if( error ) {
                    reject( error );
                }
                resolve( {
                    stdout: stdour,
                    stderr: stderr
                } );
            } );
        } );
    };
}

module.exports = Executor;
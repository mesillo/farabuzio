import { ApplicationError } from "./errors/ApplicationError";

let funzioneAncoraPiuBrutta = () => {
    throw new Error( "funzioneAncoraPiuBrutta()" );
}

let funzioneBrutta = () => {
    try{
        funzioneAncoraPiuBrutta();
    } catch( error ) {
        console.dir( error.stack );
        throw new ApplicationError( "funzioneBrutta()", error );
    }
}

try {
    funzioneBrutta();
} catch( e ) {
    if( e instanceof ApplicationError ) {
        console.log( "=== ApplicationError ===" );
        console.log( e.getReasonStack() );
    }
}
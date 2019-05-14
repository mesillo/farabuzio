//import { ApplicationError } from "./errors/ApplicationError";
import { RMQApplicationError, ApplicationError } from "./errors/RMQApplicationError";

let funzioneAncoraPiuBrutta = () => {
    throw new Error( "funzioneAncoraPiuBrutta()" );
}
//let funzioneBrutta = () => {
//    try{
//        funzioneAncoraPiuBrutta();
//    } catch( error ) {
//        console.log( error.stack );
//        throw new ApplicationError( "funzioneBrutta()", error );
//    }
//}
/////////////////////////////////////////////////////////////////////////
//let RMQfunzioneBrutta = () => {
//    try{
//        funzioneAncoraPiuBrutta();
//    } catch( error ) {
//        console.log( error.stack );
//        throw new RMQApplicationError( "funzioneBrutta()", error );
//    }
//}
/////////////////////////////////////////////////////////////////////////
let RMQfunzioneBrutta = () => {
    try{
        funzioneAncoraPiuBrutta();
    } catch( error ) {
        //console.log( error.stack );
        throw new RMQApplicationError( "funzioneBrutta()", error ).setItentificationString( "SPECIFIC_RMQ_ERROR" );
    }
}

try {
    //funzioneBrutta();
    RMQfunzioneBrutta();
} catch( e ) {
    if( e instanceof ApplicationError ) {
        console.log( "=== ApplicationError ===" );
        //console.log( e.getReasonStack() );
        //console.log( "===>> " + e.getIdentificationString() );
        //console.log( "-->> " + e.getErrorClass() );
        e.log();
    } else {
        console.log( "=== Error ===" );
        //console.dir( e, { depth: null } );
    }
}
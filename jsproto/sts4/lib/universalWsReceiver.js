"use strict";

class UniversalWsReceiver {
    constructor( webSoket, clientInfos ) {
        this.ws = webSoket;
        clientInfos = clientInfos;
        this._setUpEvents( this.ws );
    }

    _setUpEvents( ws ) {
        //console.log( "===== HIT =====" );
        //ws.send( "===== HIT =====" );
        ws.on( "message", ( message ) => {
            //console.dir( message, { depth: null } );
            //ws.send( "PONG" );
            ws.send( "R: " + message );
        } );
    }
}

module.exports = UniversalWsReceiver;
"use strict";

class UniversalWsReceiver {
    constructor( webSoket, clientInfos ) {
        this.ws = webSoket;
        clientInfos = clientInfos;
    }

    _setUpEvents() {
        this.ws.on( "message", ( msg ) => {
            
        } );
    }
}

module.exports = UniversalWsReceiver;
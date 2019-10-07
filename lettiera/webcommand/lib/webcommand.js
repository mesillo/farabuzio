"use strict";

const defines = require( "../defines" );
const http = require( "http" );
const Render = require( "./render/render" );
const Executor = require( "./executor/executor" );
const RequestManager = require( "./requestmanager/requestmanager" );
const Uploader = require( "./uploader/uploader" );

class WebCommand {
    /**
     * The constructor
     * @param {number} port 
     */
    constructor( port = defines.SERVERPORT ) {
        this.port = port;
        this.server = http.createServer( this.manageRequest );
    }

    run() {
        Executor.execute( "whoami" )
            .then( ( streams ) => {
                if( streams.stdout === "root\n" ) {
                    console.error( "Not as Root!!!" );
                    process.exit( 255 );
                }
                this.server.listen( this.port );
                console.log( "WebCommand listening on port " + this.port );
            } )
            .catch( ( error ) => {
                console.error( error );
                process.exit( 255 );
        	} );
    }

    async manageRequest( request, response ) {
        let rsp = new Render( response );
        let upld = new Uploader( rsp );
        //let reqMan = new RequestManager( rsp ); // TODO: use object...
        rsp.setHeaders();
        rsp.drawHtmlHeader();
        rsp.drawCommandForm();
        rsp.drawSeparator();
        await upld.manageUpload( request );
        await upld.listStorageFiles();
        rsp.drawFileUploadForm();
        rsp.drawSeparator();
        await RequestManager.commandManage( request, response ); // TODO: move from response to render...
        rsp.drawHtmlFooter();
        rsp.close();
    };
}

module.exports = WebCommand;
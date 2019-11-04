"use strict";


class RequestManager {
	constructor( lambdaSvr ) {
		this.lambdaSvr = lambdaSvr;
	}

	async managePostRequets( request, response ) {
		let requestBody = await this._getRequestBody( request );
		let invocation = JSON.parse( requestBody );
		console.dir( invocation, { depth : null } );
		let lresult = await this.lambdaSvr.fireLambda( invocation.lambda, invocation.event, invocation.context );
		response.write( lresult );
	}
	
	async manageGetRequets( request, response ) {
		// TODO: do it better...
		if( request.url === "/reboot" || request.url === "/exit" ) {
			response.end( JSON.stringify( {
				message : "Exiting!"
			} ) );
			process.exit( 0 ); // TODO: find a better way...
		}
		response.write(
			JSON.stringify(
				this.lambdaSvr.getLambdaList()
			)
		);
	}
	
	async manageRequets( request, response ) {
		if( request.method === "POST" ) {
			await this.managePostRequets( request, response );
		} else {
			await this.manageGetRequets( request, response );
		}
	}

	async _getRequestBody( request ) {
		return new Promise( ( resolve, reject ) => {
			let body = "";
			request.on( "data", ( data ) => {
				body += data;
				// TODO: checks on length... ???
			} );
			request.on( "end", () => {
				resolve( body );
			} );
		} );

	}
}

module.exports = RequestManager;

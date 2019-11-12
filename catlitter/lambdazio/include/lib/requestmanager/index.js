"use strict";

const Xutem = require( "../utils/xutem/xutem" );

const LAMBDA_HANDLER_REJECTION_HTTP_CODE = 500; // TODO: define it better; chech the codes mining...

class RequestManager {
	constructor( lambdaSvr ) {
		this.lambdaSvr = lambdaSvr;
		this.executionMutex = new Xutem();
		this.responseBuffer = {
			status : 200,
			message : ""
		};
	}

	getResponseBuffer() {
		return JSON.parse( JSON.stringify( this.responseBuffer ) );
	}

	getStatus() {
		return this.responseBuffer.status;
	}

	getMessage() {
		return this.responseBuffer.message;
	}

	_addToMessage( buffer ) {
		let type = typeof buffer;
		let chunk = "";
		switch( type ) {
			case "undefined":
				chunk = "<undefined>";
				break;
			case "symbol":
				chunk = "<symbol>";
				break;
			case "function":
				chunk = "<function>";
				break;
			case "object":
				// null is "object" too...
				if( buffer === null ){
					chunk = "<null>";
				} else {
					chunk = JSON.stringify( buffer );
				}
				break;
			case "boolean":
				chunk = buffer ? "TRUE" : "FALSE"; 
			case "number":
			case "bigint":
				chunk = buffer.toString();
			case "string":
				chunk = buffer;
				break;
			default:
				chunk = "<UNMANAGED_RETURN_TYPE>";
		}
		this.responseBuffer.message += chunk; //TODO: add a newline ???
	}

	async managePostRequets( request, response ) {
		let requestBody = await this._getRequestBody( request );
		let invocation = JSON.parse( requestBody );
		//console.dir( invocation, { depth : null } );
		let releaseMutex = await this.executionMutex.acquire();
		try {
			this._addToMessage( await this.lambdaSvr.fireLambda( invocation.lambda, invocation.event, invocation.context ) );
		} catch( error ) {
			this.responseBuffer.status = LAMBDA_HANDLER_REJECTION_HTTP_CODE;
			this._addToMessage( error.message );
		} finally {
			releaseMutex();
		}
		return;
	}
	
	async manageGetRequets( request, response ) {
		// TODO: do it better...
		if( request.url === "/reboot" || request.url === "/exit" ) {
			response.end( JSON.stringify( { //TODO: use a better way that dont request the response object...
				message : "Exiting!"
			} ) );
			process.exit( 0 ); // TODO: find a better way...
		}
		this._addToMessage( this.lambdaSvr.getLambdaList() );
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

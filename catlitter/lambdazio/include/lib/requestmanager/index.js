"use strict";
//const Xutem = require( "../utils/xutem/xutem" );
const LAMBDA_HANDLER_REJECTION_HTTP_CODE = 500; // TODO: define it better; chech the codes mining...
const DEFAULT_CONTEXT_STRING = "{\"callbackWaitsForEmptyEventLoop\":true,\"functionVersion\":\"$LATEST\",\"functionName\":\"testOS\",\"memoryLimitInMB\":\"128\",\"logGroupName\":\"/aws/lambda/testOS\",\"logStreamName\":\"2019/11/13/[$LATEST]09f74d8f97e54accaa5baaebc093c689\",\"invokedFunctionArn\":\"arn:aws:lambda:eu-central-1:102165533286:function:testOS\",\"awsRequestId\":\"36c7c7c1-295f-43f6-a91e-734d940e321e\"}"; //TODO: modify for better realism...
//TODO: implement a better default context...
/*{ callbackWaitsForEmptyEventLoop: [Getter/Setter],
  succeed: [Function],
  fail: [Function],
  done: [Function],
  functionVersion: '$LATEST',
  functionName: 'testOS',
  memoryLimitInMB: '128',
  logGroupName: '/aws/lambda/testOS',
  logStreamName: '2019/11/13/[$LATEST]09f74d8f97e54accaa5baaebc093c689',
  clientContext: undefined,
  identity: undefined,
  invokedFunctionArn: 'arn:aws:lambda:eu-central-1:102165533286:function:testOS',
  awsRequestId: '36c7c7c1-295f-43f6-a91e-734d940e321e',
  getRemainingTimeInMillis: [Function: getRemainingTimeInMillis] }*/

class RequestManager {
	constructor( lambdaSvr ) {
		this.lambdaSvr = lambdaSvr;
		//this.executionMutex = new Xutem();
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

	_normalizeContext( context ) {
		let typeofContext = typeof context;
		if( typeofContext !== "object" )
			return JSON.parse( DEFAULT_CONTEXT_STRING );
		return context;
	}

	async managePostRequets( request, response ) {
		let requestBody = await this._getRequestBody( request );
		let invocation = JSON.parse( requestBody );
		//console.dir( invocation, { depth : null } );
		//let releaseMutex = await this.executionMutex.acquire();
		invocation.context = this._normalizeContext( invocation.context );
		try {
			this._addToMessage( await this.lambdaSvr.fireLambda( invocation.lambda, invocation.event, invocation.context ) );
		} catch( error ) {
			this.responseBuffer.status = LAMBDA_HANDLER_REJECTION_HTTP_CODE;
			this._addToMessage( error.message );
		}
		//finally {
		//	releaseMutex();
		//}
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

"use strict";

const url = require( "url" );
const defines = require( "../../defines" );
const Render = require( "../render/render" );
const Commands = require( "../commands/commands" );
const Executor = require( "../executor/executor" );

class RequestManager {
	/**
	 * The constructor
	 * @param {Render} render
	 */
	constructor( render ) {
		if( ! render || ! render.isOpen() ) {
			throw new Error( "Invalid Render provided!" );
		}
		this.render = render;
	}

	async commandManage( request ) {
		if( request !== null && this.render.isOpen() ) {
			return await RequestManager.commandManage( request, this.render );
		}
	}

	///// Static Methods /////
	static commandManage( request, response ) {
		return new Promise( ( resolve, reject ) => {
			let parsedRequest = url.parse( request.url, true );
			let requestParameters = parsedRequest.query;
			if( parsedRequest.pathname === defines.COMMANDURL ) { // found a form rend request...
				RequestManager._manageFormRequest( requestParameters, response );
				resolve();
			} else if( parsedRequest.pathname === defines.EXECUTIONURL ) { // found a command execution request...
				RequestManager._manageExecutionRequest( requestParameters, response )
					.then( resolve )
					.catch( reject );
			} else {
				resolve();
			}
		} );
	}

	static _manageFormRequest( requestParameters, response ) {
		if( requestParameters[ defines.FORMREQUSTEPARAM ] ) {
			Render.drawForm( requestParameters[ defines.FORMREQUSTEPARAM ], response );
		}
	}

	static _manageExecutionRequest( requestParameters, response ) {
		return new Promise( ( resolve, reject ) => {
			if( requestParameters[ defines.EXECUTEREQUESTPARAM ] ) { // verified execution request...
				let commandStr = RequestManager._getCommandString( requestParameters );
				Executor.execute( commandStr )
					.then( ( streams ) => {
						Render.drawCommandResponse( response, streams, commandStr );
					} )
					.catch( ( error ) => {
						console.error( error );
						Render.drawError( error, response );
					} )
					.finally( () => {
						resolve();
					} );
			}
		} );
	}

	static _getCommandString( requestParameters ) {
		let commandDefinition = Commands.getCommands()[ requestParameters[ defines.EXECUTEREQUESTPARAM ] ];
		let commandString = commandDefinition.cmd;
		if( commandDefinition.parameters && commandDefinition.parameters.length ) {
			console.info( "Command composition..." );
			for( let param in requestParameters ) {
				if( param !==  defines.EXECUTEREQUESTPARAM ) {
					let placeHolder = defines.PLACEHOLDERBOUNDARIES + param + defines.PLACEHOLDERBOUNDARIES;
					let value = requestParameters[ param ];
					commandString = commandString.replace( placeHolder, value );
				}
			}
		}
		console.info( `Executing: ${commandString}` );
		return commandString;
	}
}

module.exports = RequestManager;
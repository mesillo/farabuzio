"use strict";

const jose = require( "jose" );
const {
	//JWE,   // JSON Web Encryption (JWE) 
	JWK,   // JSON Web Key (JWK)
	JWKS,  // JSON Web Key Set (JWKS)
	//JWS,   // JSON Web Signature (JWS)
	JWT,   // JSON Web Token (JWT)
	errors // errors utilized by jose
} = jose;

const GOOD_RESPONDE_STATUSCODE = 200;
const KEYS_TTL = 1; // in munutes
const KEYS_UPDATE_TIMEOUT = 30 // in seconds

class TokenValidator {
	constructor( endpoint ) {
		this.endpoint = endpoint;
		this.agent = ( endpoint.protocol === "http" ) ? require( "http" ) : require( "https" );
		this.validationOptions = {}
		this.keyCache = {
			expiration: null,
			keys: null
		};
		try {
			this.getJWKSKeyStore();
		} catch( error ) {
			console.info( "Unable to complete initialization: " + error.message );
		}
	}

	setValidationOptions( validationOptions ) {
		this.validationOptions = validationOptions;
	}

	async _getBody( response ) {
		return new Promise( ( resolve, reject ) => {
			let chunks = [];
			response.on( "data", ( chunk ) => {
				chunks.push( chunk );
			} );
			response.on( "end", () => {
				resolve( Buffer.concat( chunks ) );
			} );
		} );
	}

	_getRequetOptions( method, queryStr ) {
		return {
			host: this.endpoint.hostname,
			port: this.endpoint.port,
			path: queryStr,
			method: method,
		};
	}

	async _GET( queryStr ) {
		return new Promise( ( resolve, reject ) => {
			let request = this.agent.request( this._getRequetOptions( "GET", queryStr ), async ( response ) => {
				if( response.statusCode !== GOOD_RESPONDE_STATUSCODE ) {
					reject( new Error( `Server retourned ${response.statusCode}.` ) );
				}
				resolve( await this._getBody( response ) );
			} );
			request.on( "error", ( error ) => {
				reject( error );
			} );
			request.end();
		} );
	}

	async getOpenidConfiguration() {
		return JSON.parse( ( await this._GET( "/.well-known/openid-configuration" ) ).toString() );
	}

	async getJwksUri() { //TOTO: rename...
		let jwks_uri = ( await this.getOpenidConfiguration() ).jwks_uri;
		return JSON.parse( ( await this._GET( jwks_uri ) ).toString() );
	}

	_isKeyCacheExpired() {
		let now = new Date();
		if( this.keyCache.expiration && ( now.getTime() < this.keyCache.expiration.getTime() ) ) {
			return false;
		}
		console.log( "=== Keys Cache Expired!!! ===" );
		return true;
	}

	async _refreshKeyCache() {
		let expiration = new Date();
		expiration.setSeconds( expiration.getSeconds() + KEYS_UPDATE_TIMEOUT );
		this.keyCache.expiration = expiration;

		try {
			let jwks = await this.getJwksUri();
			let keys = [];
			for( let jwk of jwks.keys ) {
				keys.push( JWK.asKey( jwk ) );
			}
			this.keyCache.keys = new JWKS.KeyStore( keys );
		} catch( error ) {
			console.info( "Unable to obtain new keys. Delayed to: " + expiration );
			return expiration;
		}

		//let expiration = new Date();
		expiration.setMinutes( expiration.getMinutes() + KEYS_TTL );
		this.keyCache.expiration = expiration;
		console.info( "Refresh JWKS. Next refresh: " + expiration );
		
		return this.keyCache.expiration;
	}

	//async getJWKSKeyStore() {
	getJWKSKeyStore() {
		if( this._isKeyCacheExpired() ) {
			//let expiration = await this._refreshKeyCache();
			//console.info( "Refresh JWKS. Next refresh: " + expiration );
			this._refreshKeyCache();
		}
		if( this.keyCache.keys === null ) { // never initialized...
			throw new Error( "No key for avaibles for tokens validation." );
		}
		return this.keyCache.keys;
	}

	async verifyJWTToken( token, options = this.validationOptions ) {
		//console.info( "Validating JWT: " + token );
		let keyStore = await this.getJWKSKeyStore();
		return JWT.verify( token, keyStore, options );
	}
}

module.exports = TokenValidator;
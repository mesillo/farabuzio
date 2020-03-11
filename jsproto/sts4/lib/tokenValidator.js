"use strict";

const jose = require( "jose" );
const {
    JWE,   // JSON Web Encryption (JWE) 
    JWK,   // JSON Web Key (JWK)
    JWKS,  // JSON Web Key Set (JWKS)
    JWS,   // JSON Web Signature (JWS)
    JWT,   // JSON Web Token (JWT)
    errors // errors utilized by jose
} = jose;
/*
const endpoint = {
  protocol: "http/https",
  hostname: 'whatever.com',
  port: 443
}
*/
const GOOD_RESPONDE_STATUSCODE = 200;

class TokenValidator {
    constructor( endpoint ) {
        this.endpoint = endpoint;
        this.agent = ( endpoint.protocol === "http" ) ? require( "http" ) : require( "https" );
    }

    async _getBody( response ) {
        return new Promise( ( resolve, reject ) => {
            let chunks = [];
            response.on( "data", ( chunk ) => {
                //console.log( "response.data" );
                chunks.push( chunk );
            } );
            response.on( "end", () => {
                //console.log( "response.end" );
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
                //console.log( "response.statuscode" );
                //console.dir( response.statusCode );
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

    async getJWKSKeyStore() {
        let jwks = await this.getJwksUri();
        let keys = [];
        for( let jwk of jwks.keys ) {
            keys.push( JWK.asKey( jwk ) );
        }
        return new JWKS.KeyStore( keys );
    }

    async verifyJWTToken( token ) {
        let keyStore = await this.getJWKSKeyStore();
        return JWT.verify( token, keyStore );
    }
}

module.exports = TokenValidator;
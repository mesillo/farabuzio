"use strict";

const io = require( "socket.io-client" );
const https = require( "https" );

//const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1OTI4MzE3NzcsImV4cCI6MTU5MjkxODE3NywiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGE2ODYzMzY2YzUuZXUuZm0tY2xvdWQuY29tIiwiYXVkIjpbImh0dHBzOi8vdG9rZW4uc3RzdjQuNTBhNjg2MzM2NmM1LmV1LmZtLWNsb3VkLmNvbS9yZXNvdXJjZXMiLCJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImNsaWVudF9pZCI6Im1hc3RlciIsInN1YiI6IjkxMzI2N2I4LTU0MDUtNDk4ZC03NjE4LTA4ZDc2OWJiMWY4ZiIsImF1dGhfdGltZSI6MTU5MjgzMTc3NywiaWRwIjoibG9jYWwiLCJyZXZlYWxfYWNjb3VudF9pZCI6IjEwMTUxMjciLCJyZXZlYWxfdXNlcl9pZCI6IjE1OTgwMjgiLCJyZXZlYWxfdXNlcl90eXBlX2lkIjoiMiIsInVuaXF1ZV9uYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx1Y2FzQFRFdGVzdC5jb20iLCJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwianRpIjoiYTZmZGRkN2JlZDA3MjhmNzUxYWNlMGRkNmU2NTJmZWYiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImFtciI6WyJwd2QiXX0.M0qkrBqhda9bycLfjVnd0PoUhKZQE6x3qn_4-UNOYve6lYHWsDcOHJROOU0_kwKiiMO5zdwpzhI8Cdpbm9lvw-bjna4ESta0C-O5ISvUBFsiLtHZ4Et22lhMWpHeuYPZpEFQESWGB_gP9BUdpr6B0iACAAJ22KuxZgetJEM4M9ZU1YlRV0mwhZJWNloW1mquLSU1VuRVBBrzSDMs2pzWKGoZ26s3oicMjLZ9NP9NU3d6aKnTW84nieWftOwNOoqevaTT-_0k7k8xKf3Gatvi-uKUU1TI4esmBPJjQRJoY6MvGsYUsIC-VVogYaukp9n5DM4dKO-kje0Sn2zgyxj4yIz07-qHrKL7GlcQ4wyL7SevuZNOxpvDJtSID1IqZPxrqX7dnSAchzju-_FdZ9vpXbsu7oVoakQFUJMZkAa1uuy-gpH5_jXTQhUqOjPEAA8uQk_XS8-Vy3vkXOIOzHJFYd91FXGYq0SToWbKExaGzywEYU3QwyOA82YjKfnZuThLk87HAj1npEiaxkQ0q9J0r7FmFZgE7bXD9oJn2WdDaU5THdFT5KhGm_ImWXeUPxj4pO6_XMhLm0lgseinK4JtTiAOWTENoMxA9lEjR_OKzVryg-lTBZ3l-HLZiIXti5uhiKPqPDDx6JodiF6mmhut6qlSxf1PA7pdcZvICkG86zw";
const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1OTI4NDQ3MDUsImV4cCI6MTU5MjkzMTEwNSwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MDNhY2E0MWEwOGQudGVzdC51cy5mbS1jbG91ZC5jb20iLCJhdWQiOlsiaHR0cHM6Ly90b2tlbi5zdHN2NC41MDNhY2E0MWEwOGQudGVzdC51cy5mbS1jbG91ZC5jb20vcmVzb3VyY2VzIiwib3BlbmlkIiwicHJvZmlsZSIsInJldmVhbCJdLCJjbGllbnRfaWQiOiJtYXN0ZXIiLCJzdWIiOiI0ZGM4NmUzNC1jM2E2LTQwZDgtYzgyZS0wOGQ3OWZiOTBjNWIiLCJhdXRoX3RpbWUiOjE1OTI4NDQ3MDUsImlkcCI6ImxvY2FsIiwicmV2ZWFsX2FjY291bnRfaWQiOiIxMTMwMTQyIiwicmV2ZWFsX3VzZXJfaWQiOiI1MjE3MDQ2IiwicmV2ZWFsX3VzZXJfdHlwZV9pZCI6IjEiLCJ1bmlxdWVfbmFtZSI6InRpZ2VyQHRlc3QuY29tIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidGlnZXJAdGVzdC5jb20iLCJuYW1lIjoidGlnZXJAdGVzdC5jb20iLCJlbWFpbCI6InRpZ2VyQHRlc3QuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJqdGkiOiJkZDlmYzVkYzMxYzIyNzE5Y2YyZDVhZTkzMDkxZDhiYiIsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJyZXZlYWwiXSwiYW1yIjpbInB3ZCJdfQ.CdspmCPGJG_vH8JMjpY6O3g50FOc4PxeQlfgz1lMMSDMOGh2u69GkC1-mF1m97fj5DYza9e4Z04Wf6To-UZEX7WA59Hux5ttMvfDs2sPpqMURRldx5KQO2N8socE2qS6BqM1b8mubfT1R7ds9Lrsoie_ldMiFpnUF2TOnmN8ua-9OIZE5UOO3Oc8_CIn5ae7G845l4BZ2xUvFH3-KyIvtJzFsXk2z73oHwhukflw-BcHd4dgKyauG_IIFTMDgVUDbRjWKaG7I9PNVH9apcQQ8KVJ_yRltT_ULmwhWPtyrrD1YlPsY5fZirk0pBCkkWC5xlbNJMo1yfmsvKOo1lSgxZhJvs3HEK4t_0IC8PcTem-M2PghGYFXaXfj5r3xpPsw8bW92ucYYmq1hN5GShd6iPhpmiaEsm0EvAhORzWH6VoaDVskc3-7FyyJ_tIkrjzP3yXEKPXTv4vAm5eVADkgBw6GhLi4uuC-162wRWNj-SSM4RMqUCz3uTE_HXlK1Kq7gQSwCCyMLqsRbd4wFNgLIfY-DRNbYW6XL992ZNoVRuQy3AAa_s06nF5ParZbz3yrkmeHttBQHQ_u7C_a411DeVvdoqP26CpJb4HZVwWbtThiWfO5Pea080qVgPUNrKczHuSQvqha2liOsmBMwIi6Stph-9uHo44yI3LxdzPZSNY";
const DATA_DELAY = 2500;
//const DATA_DELAY = 60000;
const PROCESS_EXIT_DELAY = 5000;

// 0) Getting Cookies from ALB (Load balancer)... this is not a part of protocol but a method to simulate the behavior of a Browser/WebView in NodeJS environment.
// AWS ALB is designed to deal with Web Clients.
const options = {
	//hostname: "genericws.eu.smb.vzc-iot.com", // The ALB hostname
	hostname: "genericws.test.us.smb.vzc-iot.com", // The ALB hostname
	port: 443,
	path: "/status", // The HealthCheck path
	method: "GET"
};

const prepareCoockie = ( rawCookies ) => { // Obtain Cookie Browser-Like string from the "set-cookie" ALB (server) response.
	let cookieString = "";
	for( let setC of rawCookies ) {
		cookieString += setC.split( " " )[0] + " ";
	}
	return cookieString;
};

const getCookieFormALB = ( options ) => { // Query the ALB HealthCheck path for obtain Cookies
	return new Promise( ( resolve, reject ) => {
		const request = https.request( options, ( response ) => {
			if( response.statusCode === 200 ) {
				resolve( prepareCoockie( response.headers["set-cookie"] ) );
			} else {
				reject( `statusCode: ${response.statusCode}` );
			}
		});

		request.on( "error", ( error ) => {
			console.info( "=== cookie retrival error ===" )
			reject( error );
		} );

		request.end();
	} );
};

getCookieFormALB( options ).then( ( parsedCoockies ) => {
	runClient( parsedCoockies ); // Start the Socket.IO client application with ALB Cookies.
	//runClient( null );
	// If you will run the client in a Browser/WebView Like environment the parsedCoockies options nust be null or undefined.
} ).catch( ( error ) => {
	console.error( error );
	process.exit( 1 );
} );

// 0.1) Running the client.
const runClient = ( parsedCoockies = null ) => {
	const ioClientOptions = {
		path: "/ws-receiver", // listening path is configurable.
		query: {
			token: JWT
		},
		reconnection: true,
		//transports: [ "websocket" ],
		transports: [ "polling" ],
		//rejectUnauthorized: false // self-signed server cert,
	};
	if( parsedCoockies !== null ) {
		ioClientOptions.transportOptions = {
			polling: {
				extraHeaders: {
					"Cookie": parsedCoockies
				}
			}
		};
	}

	//const socket = io( "https://genericws.eu.smb.vzc-iot.com:443", ioClientOptions );
	const socket = io( "https://genericws.test.us.smb.vzc-iot.com:443", ioClientOptions );

	// 1) if the server cant validate the token it emit a "error" event an, immediatly after, close the soket.
	// So client must listen to this events
	//socket.on( "connecting", () => {
	//	console.log( "==============" );
	//	console.log( "= connecting =" );
	//	console.log( "==============" );
	//} );

	socket.on( "error", ( error ) => {
		console.log( "== ERROR SOCKET EVENT ==" );
		console.log( new Date().toUTCString() );
		console.dir( error );
	} );
	socket.on( "disconnect", () => {
		console.log( "\t\t\t=== Disconnected from server: " + new Date().toUTCString() + " ===" );
		//setTimeout(
		//	() => { process.exit(); },
		//	PROCESS_EXIT_DELAY
		//);
	} );

	let id = 0;

	class Messages {
		static startSession( socket ) {
			socket.emit( "startSession", {
		 		thingType: 20,
				clientProtocolVersion: "1",
				id: id.toString(),
		 		schema: {
					position: { // name of data schema.
						dynamic: [ // dynamic field to be populated with value in position messages.
							"Header.UpdateTime",
							"Header.SequenceNumber",
							"GPS.Latitude",
							"GPS.Longitude",
							"GPS.FixQuality",
							"GPS.Speed",
							"GPS.Heading",
							"GPS.Altitude",
							"Radio.GsmSignalLevel",
							"Radio.GsmCSQ",
							"PowerSupply.BatVoltage",
							"Mobile.EventType",
							"Mobile.CorrelationId"
						],
						static: { // static key: value added to all messages.
							"Mobile.DeviceType": "static-devicetype",
							"Mobile.DeviceId": "static-deviceid",
							"Mobile.OS": "WednesdayOS",
							"Mobile.OSVersion": "007",
							"Mobile.AppName": "static-FSD",
							"Mobile.AppVersion": "example"
						},
						token: { // Tocken info : standard decoded value to add on messages.
							"reveal_user_id": "Header.ThingId",
							"reveal_account_id": "Header.AccountId"
						}
					}
				}
			},
			( event, payload ) => {
				if( event === "sessionEstablished" && payload.id === id.toString() ) {
					// ack received, session estabilished.
					console.log( "= sessionEstablished =" );
					// 4) start transmita data (in this case position)
					setInterval( ( ) => {
						Messages.sendPosition( socket );
					}, DATA_DELAY);
				} else if( event === "sessionFailed" ) {
					// nack received, session failed.
					console.log( "sessionFailed: " + payload.error );
					process.exit();
				}
			}
			);
		}

		static sendPosition( socket ) {
			let stringId = (++id).toString();
			socket.emit( "position", {
				id: stringId,
				data: [
				(new Date()).toISOString(), //"Header.UpdateTime",
				parseInt( stringId ), //"Header.SequenceNumber",
				44.9877331, //"GPS.Latitude",
				12.0287777, //"GPS.Longitude",
				100, //"GPS.FixQuality",
				80, //"GPS.Speed",
				0.12, //"GPS.Heading",
				10, //"GPS.Altitude",
				22, //"Radio.GsmSignalLevel",
				33, //"Radio.GsmCSQ",
				12, //"PowerSupply.BatVoltage",
				15, //"Mobile.EventType",
				"idontknow" //"Mobile.CorrelationId",
			] },
			( event, payload ) => { // 5) check receiving
				if( event === "ack" && payload.id === stringId ) {
					console.log( new Date().toUTCString() + ": Ack pkt " + stringId );
					// packet acked
				} else if( event === "nack" ) {
					// packet nacked; retry o discard.
					console.log( "=== ERROR ===" );
					console.log( new Date().toUTCString() );
					console.error( payload.error );
					process.exit();
				}
			} );
		} 
	}

	// 2) when the server validate the token the "connect" event is raised.
	socket.on( "connect", () => {
		console.log( "== Connected to the server ==" );
		// 3) now client can emit a "startSession" event
		Messages.startSession( socket );
	} );
};

//runClient( null );

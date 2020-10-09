"use strict";

const io = require( "socket.io-client" );
const https = require( "https" );

//const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1OTI4MzE3NzcsImV4cCI6MTU5MjkxODE3NywiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGE2ODYzMzY2YzUuZXUuZm0tY2xvdWQuY29tIiwiYXVkIjpbImh0dHBzOi8vdG9rZW4uc3RzdjQuNTBhNjg2MzM2NmM1LmV1LmZtLWNsb3VkLmNvbS9yZXNvdXJjZXMiLCJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImNsaWVudF9pZCI6Im1hc3RlciIsInN1YiI6IjkxMzI2N2I4LTU0MDUtNDk4ZC03NjE4LTA4ZDc2OWJiMWY4ZiIsImF1dGhfdGltZSI6MTU5MjgzMTc3NywiaWRwIjoibG9jYWwiLCJyZXZlYWxfYWNjb3VudF9pZCI6IjEwMTUxMjciLCJyZXZlYWxfdXNlcl9pZCI6IjE1OTgwMjgiLCJyZXZlYWxfdXNlcl90eXBlX2lkIjoiMiIsInVuaXF1ZV9uYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx1Y2FzQFRFdGVzdC5jb20iLCJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwianRpIjoiYTZmZGRkN2JlZDA3MjhmNzUxYWNlMGRkNmU2NTJmZWYiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImFtciI6WyJwd2QiXX0.M0qkrBqhda9bycLfjVnd0PoUhKZQE6x3qn_4-UNOYve6lYHWsDcOHJROOU0_kwKiiMO5zdwpzhI8Cdpbm9lvw-bjna4ESta0C-O5ISvUBFsiLtHZ4Et22lhMWpHeuYPZpEFQESWGB_gP9BUdpr6B0iACAAJ22KuxZgetJEM4M9ZU1YlRV0mwhZJWNloW1mquLSU1VuRVBBrzSDMs2pzWKGoZ26s3oicMjLZ9NP9NU3d6aKnTW84nieWftOwNOoqevaTT-_0k7k8xKf3Gatvi-uKUU1TI4esmBPJjQRJoY6MvGsYUsIC-VVogYaukp9n5DM4dKO-kje0Sn2zgyxj4yIz07-qHrKL7GlcQ4wyL7SevuZNOxpvDJtSID1IqZPxrqX7dnSAchzju-_FdZ9vpXbsu7oVoakQFUJMZkAa1uuy-gpH5_jXTQhUqOjPEAA8uQk_XS8-Vy3vkXOIOzHJFYd91FXGYq0SToWbKExaGzywEYU3QwyOA82YjKfnZuThLk87HAj1npEiaxkQ0q9J0r7FmFZgE7bXD9oJn2WdDaU5THdFT5KhGm_ImWXeUPxj4pO6_XMhLm0lgseinK4JtTiAOWTENoMxA9lEjR_OKzVryg-lTBZ3l-HLZiIXti5uhiKPqPDDx6JodiF6mmhut6qlSxf1PA7pdcZvICkG86zw";
//const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1OTI4OTYwMjUsImV4cCI6MTU5Mjk4MjQyNSwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MDNhY2E0MWEwOGQudGVzdC51cy5mbS1jbG91ZC5jb20iLCJhdWQiOlsiaHR0cHM6Ly90b2tlbi5zdHN2NC41MDNhY2E0MWEwOGQudGVzdC51cy5mbS1jbG91ZC5jb20vcmVzb3VyY2VzIiwib3BlbmlkIiwicHJvZmlsZSIsInJldmVhbCJdLCJjbGllbnRfaWQiOiJtYXN0ZXIiLCJzdWIiOiI0ZGM4NmUzNC1jM2E2LTQwZDgtYzgyZS0wOGQ3OWZiOTBjNWIiLCJhdXRoX3RpbWUiOjE1OTI4OTYwMjUsImlkcCI6ImxvY2FsIiwicmV2ZWFsX2FjY291bnRfaWQiOiIxMTMwMTQyIiwicmV2ZWFsX3VzZXJfaWQiOiI1MjE3MDQ2IiwicmV2ZWFsX3VzZXJfdHlwZV9pZCI6IjEiLCJ1bmlxdWVfbmFtZSI6InRpZ2VyQHRlc3QuY29tIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidGlnZXJAdGVzdC5jb20iLCJuYW1lIjoidGlnZXJAdGVzdC5jb20iLCJlbWFpbCI6InRpZ2VyQHRlc3QuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJqdGkiOiJkZDkxYzU3MmFmY2FmZjVmYjA2MWFhODliMjkzMzRkMSIsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJyZXZlYWwiXSwiYW1yIjpbInB3ZCJdfQ.iy5GXQtUT2Af1FctSSL3LYk2qaMbhy50JvUP-ZlXH94UFzPzJCtb7Il5xURvzs95nblLa7Qm1HwJjhDBk5oMTHDgWqMTiZTYblgOiOcGQWiDnhzITO-IvnBW6T-Qwcw366DN3KNh87vSPT4jl7Ty20BDPE1KXYt476mUU_jXPWn3pvpUNwkAkUf5BAZoCe9bhOSumpNBpl5APgfhDqFXTSiJq39dL_CUm0wgTytbhKJL6Rrzb-LdoRizMVggi-OeqpmQmr1pNkPSCXGHh7HquAMGzK7b2dNN1y7FF_Jk3fz7HBcWQCyIgFtxQJq5ZyXqfrFDjRXfZ0fYxokRDoCdL5u4kYf5M4NQvv-u5h3JZHPPVh3BaYX_G1Vm7w6USTiw456UJoUGX5xJxXen4tUJDTs943FF6ajOLsrOMf00HJwwGydy8B2wJ6fZYn-0tMd--jAALzPbtluuJNGaloV3ApySt9Lp-UWKMeTR0R6QyzSXjsg0LRvTOWLcrXxG19LAAIFL2oWWEaIfosnxNQ5NtWR9VbML-NTaHaDVcLIBRUvQLhTmHX8WH6ViOQ_9s2TzX-oXxWJN5TEYzY2xvogih7SxR-WIYPpf2IrVB0IF46AXd8LeDDOc_wdBvVrgVSYDyCMW1FAtUJPuTVXUB9fA_OnEaBzscR7vygO2mCmgOLw";
//const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMTlCNkNENTREN0YwMkNDMkY1MUVEOTNCNTU4MURCQjRBNjE1N0EiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJFaG0yelZUWDhDekM5UjdaTzFXQjI3U21GWG8ifQ.eyJuYmYiOjE1OTk1NzQ2MzEsImV4cCI6MTU5OTU3NTgzMSwiaXNzIjoiaHR0cHM6Ly9hdXRoLmRldi5kZXZlbG9wbWVudC5mbGVldG1hdGljcy5jb20vdG9rZW4iLCJhdWQiOlsiaHR0cHM6Ly9hdXRoLmRldi5kZXZlbG9wbWVudC5mbGVldG1hdGljcy5jb20vdG9rZW4vcmVzb3VyY2VzIiwib3BlbmlkIiwicHJvZmlsZSIsInJldmVhbCJdLCJjbGllbnRfaWQiOiJtYXN0ZXIiLCJzdWIiOiI3MGI4YjdkOC02ZTk5LTRjZDgtNzI1Yy0wOGQ3YmY4MmIwZmQiLCJhdXRoX3RpbWUiOjE1OTk1NzQ2MzEsImlkcCI6ImxvY2FsIiwicmV2ZWFsX2FjY291bnRfaWQiOiIxMTI2NzU4IiwicmV2ZWFsX3VzZXJfaWQiOiI0OTgxMjk2IiwicmV2ZWFsX3VzZXJfdHlwZV9pZCI6IjAiLCJ1bmlxdWVfbmFtZSI6IlJlY2VpdmVyc1dzRHJpdmVyQHRlc3QuY29tIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiUmVjZWl2ZXJzV3NEcml2ZXJAdGVzdC5jb20iLCJuYW1lIjoiUmVjZWl2ZXJzV3NEcml2ZXJAdGVzdC5jb20iLCJlbWFpbCI6IlJlY2VpdmVyc1dzRHJpdmVyQHRlc3QuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJqdGkiOiIzNDk2OGU3ZmUzYTVmMjYyOGMyNWRjODRhYWZmZDU4NCIsImlhdCI6MTU5OTU3NDYzMSwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJldmVhbCJdLCJhbXIiOlsicHdkIl19.b1vmM93fzZNZfxGP1a0nzYeOV8vlxRey1e2IQQge-EUQMed5LmKjvewR_1loQimsow1Fvza6rSVdn_5bY_w6CH5qcYn9A98kvsL8znlNig-OBTpVHDvWpxJwpvBkM4HV-4NLVsJclA5JwnyacMDchLc7Dat0xXHVs9vtNkT0_K_0lMFKLoiyfJgYEi20nbpKNjvYD1bh1EZBfGzQio9K78HCpZzxboYqcDGc-ZupZ5x0U1eMfiVOiWRp1Zf5-mA2LEf_LtyfIL3jiZC6L5RL4inWuMHMZk_wcJvNySSG_nru5lJ90gEXr76cSFQcfyAK9l6o8h94DSTj2ieiB4IXnGPGvFkeF9lHjikl2jnj9YVIh51L3KGXR7RrwwBYhZtvlIs-aJ7n15sX0NTUDGgTNknk-9nWzyEXoR_ycpkk7ETvLjiEHQ_iY076wHTSQodmaDeh3oGllUwUjKif8alMFkEtbg0md_grhJKYpToO4bfECMpvfOFJ4YqchEIjp_JK6xbWOvL-fBcqqQSdNivXMRKkr4LWFOYZbE8tiWQcQZhSc_cXxZ1VESwWUgNnUUQuUrqC8kV9gzEDLq8xzh7jQ2Ijt3cHcjCwSEYlVyNHInZiLq-Ha1LE1ewkN9n2Ev_BrpQFxAOPtBq7bVS3UyHaiuCVxo5oM9nEcsH8DuVsS4w";
const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJDREY5REVGNkI2RDMwNTM3QTdFRTZENzI3MDYxQzkxQzgzMTQ1MjkiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJMTi1kNzJ0dE1GTjZmdWJYSndZY2tjZ3hSU2sifQ.eyJuYmYiOjE2MDAyMzk3OTksImV4cCI6MTYwMDMyNjE5OSwiaXNzIjoiaHR0cHM6Ly9hdXRoLmV1LmZsZWV0bWF0aWNzLmNvbS90b2tlbiIsImF1ZCI6WyJodHRwczovL2F1dGguZXUuZmxlZXRtYXRpY3MuY29tL3Rva2VuL3Jlc291cmNlcyIsIm9wZW5pZCIsInByb2ZpbGUiLCJyZXZlYWwiXSwiY2xpZW50X2lkIjoibWFzdGVyIiwic3ViIjoiOTEzMjY3YjgtNTQwNS00OThkLTc2MTgtMDhkNzY5YmIxZjhmIiwiYXV0aF90aW1lIjoxNjAwMjM5Nzk5LCJpZHAiOiJsb2NhbCIsInJldmVhbF9hY2NvdW50X2lkIjoiMTAxNTEyNyIsInJldmVhbF91c2VyX2lkIjoiMTU5ODAyOCIsInJldmVhbF91c2VyX3R5cGVfaWQiOiIyIiwidW5pcXVlX25hbWUiOiJsdWNhc0BURXRlc3QuY29tIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsIm5hbWUiOiJsdWNhc0BURXRlc3QuY29tIiwiZW1haWwiOiJsdWNhc0BURXRlc3QuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJqdGkiOiJhMmJiOTdlYTRhNTdiNTBmMDA4NTNkZjk4YzVmNGRlMiIsImlhdCI6MTYwMDIzOTc5OSwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJldmVhbCJdLCJhbXIiOlsicHdkIl19.y4k6ojtqLhwC_AVahOeTxAe2smrfUFj9uZCkdOIcguSN2yRhlxsIsUG_NepVzR2Jql1dVYeAae-6RCtUG0TPqX9mWeLR7XyaXwCmE6qGY8LtdwA8avc-b5I7K4toMsWPKxwowJWv1vgnubnQwaKaHawTEIaG2iXcCTJlTWKqoGYZqtcgk5ohQovch0X0lfY6hkrNgn288Yr8JoHNrIQBCrz1iCbxCJY_zKWeID3Yb3PkyxP_3trfd1HXQR0qsIfo3fMb-kprbXokmefvEXxa6cmTqn1to66vFXUJ8zdLG0XezVXE_m4TNx0XH8e9asuMbjf6TVjf-AbJQSIcYgpdBA";
const DATA_DELAY = 2500;
//const DATA_DELAY = 60000;
const PROCESS_EXIT_DELAY = 5000;

// 0) Getting Cookies from ALB (Load balancer)... this is not a part of protocol but a method to simulate the behavior of a Browser/WebView in NodeJS environment.
// AWS ALB is designed to deal with Web Clients.
const options = {
	//hostname: "genericws.eu.smb.vzc-iot.com", // The ALB hostname
	//hostname: "genericws.test.us.smb.vzc-iot.com", // The ALB hostname
	hostname: "genericws.eu.smb.vzc-iot.com",
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
	//const socket = io( "https://genericws.test.us.smb.vzc-iot.com:443", ioClientOptions );
	//const socket = io( "http://localhost:6001", ioClientOptions );
	const socket = io( "https://genericws.eu.smb.vzc-iot.com:443", ioClientOptions );

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

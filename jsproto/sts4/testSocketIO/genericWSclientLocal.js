"use strict";

const io = require( "socket.io-client" );
const https = require( "https" );

const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1ODkxODIxNzQsImV4cCI6MTU4OTI2ODU3NCwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGE2ODYzMzY2YzUuZXUuZm0tY2xvdWQuY29tIiwiYXVkIjpbImh0dHBzOi8vdG9rZW4uc3RzdjQuNTBhNjg2MzM2NmM1LmV1LmZtLWNsb3VkLmNvbS9yZXNvdXJjZXMiLCJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImNsaWVudF9pZCI6Im1hc3RlciIsInN1YiI6IjkxMzI2N2I4LTU0MDUtNDk4ZC03NjE4LTA4ZDc2OWJiMWY4ZiIsImF1dGhfdGltZSI6MTU4OTE4MjE3NCwiaWRwIjoibG9jYWwiLCJyZXZlYWxfYWNjb3VudF9pZCI6IjEwMTUxMjciLCJyZXZlYWxfdXNlcl9pZCI6IjE1OTgwMjgiLCJyZXZlYWxfdXNlcl90eXBlX2lkIjoiMiIsInVuaXF1ZV9uYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx1Y2FzQFRFdGVzdC5jb20iLCJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwianRpIjoiNDQ3MGU2NzNhMDZiYzYwZTZjYWQyNGQ2NzQyNDFkNWUiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImFtciI6WyJwd2QiXX0.aX4VTkWHE2i_fV_raFIL_jF-sUjRduW2KlvlvK1ADm-WsJTG-JzW-lGDaGo2Mm9Um4WjfWgUfUn6JYjjwAQgQYrG_AsmR2O_sOqORO-C9dvmoXLuGeOetNSBDAywHvpFGY6484MERj4g1WRUGd_FVdQCQ4CEaDN9N_oZhLVjy_A-P3GCWjI6rLTsPraH7GxEn7V8Jm0ZmAlczevxFE50xBY5Qh0ToVtmEymauJ6dL4KucBFp2DVaFMJgA9QmM_GvwaoseVF8jn926lUnxPffnt1RsDErGzC_RCEzASQjQeVjAzSMfYlt2MqgAQaJJuEuafYUTyqeYHyTOSbu5q2miztFu-RtSz4KPbQ6dnBJCVdgObYbktqo99myjcY2eHhf9PdYBczlEtK6pQYOWPAyen9CQTccsOoXLwE6nPXWTrNlm_MO1iA5EJqeXP9_m0cihgazFBJTLpC9BW5X0y9nMwNYYv8OWwBpCDZfdM0J1Pr4YkGMRhcMUPoO6OWN7L0gBIQgh82Fdr_iV3zMJ5b-E-f5iIKY-i9dvxfGZl9ki13a9qcLWXrQbjlvDM2BfleUcSLpxlnoKZT5-Iyujpxx6u58plODzjQ-TvN2JAc6l8X93KmBVzjitpOjljCMyEBz-5Q41V4pyZMqLOlbyeifYPI-xZtcPKV4JrEhlY6Tw38";
const DATA_DELAY = 2500;

// 0) Getting Cookies from ALB (Load balancer)... this is not a part of protocol but a method to simulate the behavior of a Browser/WebView in NodeJS environment.
// AWS ALB is designed to deal with Web Clients.
const options = {
	hostname: "genericws.dev.smb.vzc-iot.com", // The ALB hostname
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

//getCookieFormALB( options ).then( ( parsedCoockies ) => {
//	runClient( parsedCoockies ); // Start the Socket.IO client application with ALB Cookies.
//	// If you will run the client in a Browser/WebView Like environment the parsedCoockies options nust be null or undefined.
//} ).catch( ( error ) => {
//	console.error( error );
//	process.exit( 1 );
//} );

// 0.1) Running the client.
const runClient = ( parsedCoockies = null ) => {
	const ioClientOptions = {
		path: "/ws-receiver", // listening path is configurable.
		query: {
			token: JWT
		},
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
	//const socket = io( "https://genericws.dev.smb.vzc-iot.com:443", ioClientOptions );
	const socket = io( "http://localhost:6001", ioClientOptions );

	// 1) if the server cant validate the token it emit a "error" event an, immediatly after, close the soket.
	// So client must listen to this events

	socket.on( "error", ( error ) => {
		console.log( "== ERROR SOCKET EVENT ==" );
		console.log( new Date().toUTCString() );
		console.dir( error );
	} );
	socket.on( "disconnect", () => {
		console.log( "== Disconnected from server ==" );
		console.log( new Date().toUTCString() );
		process.exit();
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

runClient( null );

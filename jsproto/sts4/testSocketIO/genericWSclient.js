"use strict";

const io = require( "socket.io-client" );
const https = require( "https" );

const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1ODc1NjUxNTIsImV4cCI6MTU4NzY1MTU1MiwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MDNhY2E0MWEwOGQudGVzdC51cy5mbS1jbG91ZC5jb20iLCJhdWQiOlsiaHR0cHM6Ly90b2tlbi5zdHN2NC41MDNhY2E0MWEwOGQudGVzdC51cy5mbS1jbG91ZC5jb20vcmVzb3VyY2VzIiwib3BlbmlkIiwicHJvZmlsZSIsInJldmVhbCJdLCJjbGllbnRfaWQiOiJtYXN0ZXIiLCJzdWIiOiI0YTE1MTA5YS01Y2UzLTRhNTAtMGUxZi0wOGQ3M2M2ZTRiOTciLCJhdXRoX3RpbWUiOjE1ODc1NjUxNTIsImlkcCI6ImxvY2FsIiwicmV2ZWFsX2FjY291bnRfaWQiOiIxMTI4NDc2IiwicmV2ZWFsX3VzZXJfaWQiOiI1MDI2MjEyIiwicmV2ZWFsX3VzZXJfdHlwZV9pZCI6IjEiLCJ1bmlxdWVfbmFtZSI6ImFuYXN0YXNzaWFAdmVyaXpvbmNvbm5lY3QuY29tIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYW5hc3Rhc3NpYUB2ZXJpem9uY29ubmVjdC5jb20iLCJuYW1lIjoiYW5hc3Rhc3NpYUB2ZXJpem9uY29ubmVjdC5jb20iLCJlbWFpbCI6ImFuYXN0YXNzaWFAdmVyaXpvbmNvbm5lY3QuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJqdGkiOiI5YmE4NjZjODJjMDg1MTg0YmQ5NWI0NWYwZWJlZDJhYSIsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJyZXZlYWwiXSwiYW1yIjpbInB3ZCJdfQ.ORFJeZQAQmDq6NEt_rlbd4idNZfluSW_2PYFQJcgskr21FU94TIrvPDPntgt771pTa2gXwkG0xXYqL2akCt1lIaP7jMWXL2clrERFVN8eyvJcCRT9LWohUp32GY25XFY871fhFFA16UGKD8AMo147yK5Y9W3H5LOJN8tI7JCHwecrm7NsYvIHrt3RzWvShi0uwgeblqqkMtwYvYdlVJFq70qfC7riu_nt0I8F-Qe1XQPQE7WW7OVvXJkvJwFEUrOaDW22yTE6LQWlI5VlSdsz--pvJ5wVkbHKN0qVwl4T3Lx_5KeST6dka3ohWu1YX8Kpz1CvOD4mwP6SxAX4Z4UdBATbrBC2XWD_6rRnq-Xp-8jMurR6iGsAU5HWItRuY4Z2mi2FzxCQHVQVvRBD8d4j9FIpC_1h-2kkU25TkvYqQmniTsFXCz4Xyyk6ou86tIVo9pZ7yC5UaITTNCGgiV_1mj2BVgfz2325CEN8wh27TlICzp80xH8-lsirzN15sJBRYTPK2ws-fStyi7rJllwic_MEyQcF0RHtwO4l73ifTksUnXUXcejLGLuQsWTvKzU2exOfRzCbWY_NYdd9OIsLqqn1it_YRLyjK2Y_RGcnlPFjA8REUW4NeZV8G2RTVhzeBmr9lFr3fHiLW3hXXuUPTYR5E8O0kqZvXU28-P8EBk";
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
		//transports: [ "websocket" ],
		//transports: [ "polling" ],
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
	const socket = io( "https://genericws.dev.smb.vzc-iot.com:443", ioClientOptions );
	//const socket = io( "http://localhost:6001", ioClientOptions );

	// 1) if the server cant validate the token it emit a "error" event an, immediatly after, close the soket.
	// So client must listen to this events
	socket.on( "connecting", () => {
		console.log( "==============" );
		console.log( "= connecting =" );
		console.log( "==============" );
	} );

	socket.on( "error", ( error ) => {
		console.log( "== ERROR ==" );
		console.dir( error );
	} );
	socket.on( "disconnect", () => {
		console.log( "== Disconnected from server ==" );
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
					console.log( "Ack pkt " + stringId );
					// packet acked
				} else if( event === "nack" ) {
					// packet nacked; retry o discard.
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
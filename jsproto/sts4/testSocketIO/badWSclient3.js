"use strict";

const io = require( "socket.io-client" );
const https = require( "https" );

const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1ODg5NDA4NTAsImV4cCI6MTU4OTAyNzI1MCwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGE2ODYzMzY2YzUuZXUuZm0tY2xvdWQuY29tIiwiYXVkIjpbImh0dHBzOi8vdG9rZW4uc3RzdjQuNTBhNjg2MzM2NmM1LmV1LmZtLWNsb3VkLmNvbS9yZXNvdXJjZXMiLCJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImNsaWVudF9pZCI6Im1hc3RlciIsInN1YiI6IjkxMzI2N2I4LTU0MDUtNDk4ZC03NjE4LTA4ZDc2OWJiMWY4ZiIsImF1dGhfdGltZSI6MTU4ODk0MDg1MCwiaWRwIjoibG9jYWwiLCJyZXZlYWxfYWNjb3VudF9pZCI6IjEwMTUxMjciLCJyZXZlYWxfdXNlcl9pZCI6IjE1OTgwMjgiLCJyZXZlYWxfdXNlcl90eXBlX2lkIjoiMiIsInVuaXF1ZV9uYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx1Y2FzQFRFdGVzdC5jb20iLCJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwianRpIjoiY2JiOTQxMWJmOTFmZTZjMDEzYTk4MTJmNGQ2NTE2NGUiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImFtciI6WyJwd2QiXX0.J00X7tIdQTYvgT-bNZ6gwxQvwRZmfsHg3tMqupsjCCyu-HR6oGrGNcFHfE54ls3RNlQZHK8z6gjQfGKLQMZZTg-SjMYAKao6WH2pck1TNusSpQIrmWxiXycDTP9RpZhNMI6kLyNVImqybcbQ3kT65bP5tihcj27CUqds5uTgVdbXW7L5nMVkefoagyfyttYC2f4ESurA4BmZo6vV0yxIh3a0wlSyn61gpkRM15H4XIDuoVbCGFzsRMs045NQkWKBV8ODtllSrake8xkcWgM73CYctncnG6-k9Mz8_QndCJgMdpD3ccqWyRBOXir-5ZHL3ES0WiOs_CfIXZQA3TYVsldNlp78k33P0EI5NIuW6ahaGmmjzUafCrGO2iLW0kW-BKdbfwMMeO1YUahX9ohRIxP9tfl7aSEMdYxqSjUymkrecuD2o6MGJaPsEmFrCTfbBNrHThKqS91KgdmZ4mx-Q3pBidNgNlV9mYwEYo1UIA-R01jkD-9dbNdhHQC0qLVJSwt2DZfkOhUf_m8gtyfYRgd6h3hJCxhgUIEuK66zxYxJ6HIUHoJTNclSqLCmmMvaEwW_RHBn5stzNXYIyqus3Qn-ehkmE_V8XAwt35A_K64za18Q-8jHqKTSVkz16JlB9telRn5SAmMaPjiMVFECfEax9hOHkSLesfUoC-l5-fM";
//const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1ODcwMjk0NzksImV4cCI6MTU4NzExNTg3OSwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGE2ODYzMzY2YzUuZXUuZm0tY2xvdWQuY29tIiwiYXVkIjpbImh0dHBzOi8vdG9rZW4uc3RzdjQuNTBhNjg2MzM2NmM1LmV1LmZtLWNsb3VkLmNvbS9yZXNvdXJjZXMiLCJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImNsaWVudF9pZCI6Im1hc3RlciIsInN1YiI6IjkxMzI2N2I4LTU0MDUtNDk4ZC03NjE4LTA4ZDc2OWJiMWY4ZiIsImF1dGhfdGltZSI6MTU4NzAyOTQ3OSwiaWRwIjoibG9jYWwiLCJyZXZlYWxfYWNjb3VudF9pZCI6IjEwMTUxMjciLCJyZXZlYWxfdXNlcl9pZCI6IjE1OTgwMjgiLCJyZXZlYWxfdXNlcl90eXBlX2lkIjoiMiIsInVuaXF1ZV9uYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx1Y2FzQFRFdGVzdC5jb20iLCJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwianRpIjoiYzVjMjNmNDRkYjVkNWRjOWNjMGQyMjUwOWQwNzg5YTIiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImFtciI6WyJwd2QiXX0.gXgWz3EsX7w-Lb7qdyUI_0_rXeeK4PlUIeFZl4KwlN5vdDT99sKTe5L3Hpw_5KUl9KnjHZN4xLRdABDiVtvDm_f5hH7BiCnx-jI9EU8QerG7ftVTNpAoBMLk4R0YYE8mn_-rcMc2VLEnATnzyAlihre8PVCtZsiST5nloX_LPi0JqAUzZ7qOIr_34u_2-n63xGuHPDMiP1schvemHf8M42EP4RFjtc5fZ83rhrhQOSAFzXjxQOeW99KXt4YSNc0u2-Vytro0U7k_lX22W-PSKnuJzYVaTf5mKar8wi28rGjTwrrN18TI5Dusq05oJhO-87G3ufSNSOJNibHfMpeULvmEgHB6MIWkSt6msbVYcBb5es1LPqvH571jczuMe0LESPpid5Dm2VBdcqMVrpYLStMTwGIvME41cGidjmPeW9BBYcKblicVyixHQ_ht0VB80j3GKOLh1jzRvHZxFEvYMn-JQRCJTVEJ1fPrnxbgwzkglorZN2w5P_1YBoBUhcwVaazXA9txoUM42CRzS0hiWtSyJFeVbb3OLOCnitXh3pcGLBej5Cr5iGhhDtKWrSI2EEpmqzBeKYf8chQ66YvHaowFFd-wtj0NYzX3Bvein7pb_YBA7Sd4evUc9899v_-7Ez020HN-iMVBBkJ-G4apSbkeSl-MdKkM82z-X_8FSdE";
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

//getCookieFormALB( options ).then( ( parsedCoockies ) => {
//	runClient( parsedCoockies ); // Start the Socket.IO client application with ALB Cookies.
//	//runClient( null );
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
	//const socket = io( "https://genericws.dev.smb.vzc-iot.com:443", ioClientOptions );
	const socket = io( "http://localhost:6001", ioClientOptions );

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
		//static startSession( socket ) {
		//	socket.emit( "startSession", {
		// 		thingType: 20,
		//		clientProtocolVersion: "1",
		//		id: id.toString(),
		// 		schema: {
		//			position: { // name of data schema.
		//				dynamic: [ // dynamic field to be populated with value in position messages.
		//					"Header.UpdateTime",
		//					"Header.SequenceNumber",
		//					"GPS.Latitude",
		//					"GPS.Longitude",
		//					"GPS.FixQuality",
		//					"GPS.Speed",
		//					"GPS.Heading",
		//					"GPS.Altitude",
		//					"Radio.GsmSignalLevel",
		//					"Radio.GsmCSQ",
		//					"PowerSupply.BatVoltage",
		//					"Mobile.EventType",
		//					"Mobile.CorrelationId"
		//				],
		//				static: { // static key: value added to all messages.
		//					"Mobile.DeviceType": "static-devicetype",
		//					"Mobile.DeviceId": "static-deviceid",
		//					"Mobile.OS": "WednesdayOS",
		//					"Mobile.OSVersion": "007",
		//					"Mobile.AppName": "static-FSD",
		//					"Mobile.AppVersion": "example"
		//				},
		//				token: { // Tocken info : standard decoded value to add on messages.
		//					"reveal_user_id": "Header.ThingId",
		//					"reveal_account_id": "Header.AccountId"
		//				}
		//			}
		//		}
		//	},
		//	( event, payload ) => {
		//		if( event === "sessionEstablished" && payload.id === id.toString() ) {
		//			// ack received, session estabilished.
		//			console.log( "= sessionEstablished =" );
		//			// 4) start transmita data (in this case position)
		//			setInterval( ( ) => {
		//				Messages.sendPosition( socket );
		//			}, DATA_DELAY);
		//		} else if( event === "sessionFailed" ) {
		//			// nack received, session failed.
		//			console.log( "sessionFailed: " + payload.error );
		//			process.exit();
		//		}
		//	} );
		//}
		static startSession( socket ) {
			console.log( "=== BAD startSession ===" );
			setInterval( ( ) => {
				Messages.sendPosition( socket );
			}, DATA_DELAY );
		}

		static sendPosition( socket ) {
			let stringId = (++id).toString();
			console.log( `Try to send ${stringId}...` );
			socket.send( {
			//socket.emit( "position", {
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

runClient( null );

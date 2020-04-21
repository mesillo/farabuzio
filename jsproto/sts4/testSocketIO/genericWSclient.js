"use strict";

const io = require( "socket.io-client" );

const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1ODczNjk0ODUsImV4cCI6MTU4NzQ1NTg4NSwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGE2ODYzMzY2YzUuZXUuZm0tY2xvdWQuY29tIiwiYXVkIjpbImh0dHBzOi8vdG9rZW4uc3RzdjQuNTBhNjg2MzM2NmM1LmV1LmZtLWNsb3VkLmNvbS9yZXNvdXJjZXMiLCJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImNsaWVudF9pZCI6Im1hc3RlciIsInN1YiI6IjkxMzI2N2I4LTU0MDUtNDk4ZC03NjE4LTA4ZDc2OWJiMWY4ZiIsImF1dGhfdGltZSI6MTU4NzM2OTQ4NSwiaWRwIjoibG9jYWwiLCJyZXZlYWxfYWNjb3VudF9pZCI6IjEwMTUxMjciLCJyZXZlYWxfdXNlcl9pZCI6IjE1OTgwMjgiLCJyZXZlYWxfdXNlcl90eXBlX2lkIjoiMiIsInVuaXF1ZV9uYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx1Y2FzQFRFdGVzdC5jb20iLCJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwianRpIjoiNmIwMmY5MWUyNTRiNTg2YWNmYjdiYzgxMzU2MTdiN2QiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImFtciI6WyJwd2QiXX0.jb100niNnywTO2FVVT8c2ZyWmsAtJE9kC-wheIQvK3WDDURYYE16oZlfPL0c_qTE0aU6HgaKUO_LCamdWbk-A9qbA8NyZLq3gN7J_3_bMwR_-Lelhg0lMNoc9ngiGC9t_U06cJW_gtD0wFfByW9RcacN2ALAo3SqFz6MBiEXOTDldNxChs1CxAKGrUot0sLIDdxusXPOsCvuR-BiimrtEjAo6ucIS8-rvuZyprvKDrNgDS2zLXbcTn36UHyNzj7wv54tjqxnsuYP6TDTIKkAXQuJPKpDM8abR4s8GbhZTs5uQc5U2orLaNct3PHz6HQUYllC1c5rk0nXy466WBXgeqqMQdLLAEg57HCfwUVebSYki3QAkTf87IeAh0FCZ7hbZIaomnGycWK5nD59D0eyB8J4HPT5AKz7YOUeOhDK7RFaChbovRFjWL32LY809cmD30RXb74WhjnvzCimXHK6O4PezzCP30zqwMb-Aj_CWyKg28ewIRrBzorPcZTFReaR5-ykIBmDMV-XQvfeT_QRWfc0bJpEqvioOdmZ3v2xeo4aejbWrUpMf1Qg78FY--LANacne0334U82bZ2aKvKI7Y789bGBCWvjUUBASTUjHvWgDEOJAZjKPv_Tm9R7Zzpfz8N7HhxgChKIQX4iQ5ScdNgQD5XS45uQVupzKXhO0DE";
const DATA_DELAY = 2500;
///////
let rawCookies = null;
let parsedCoockies = null;

const prepareCoockie = () => {
	let cookieString = "";
	for( let setC of rawCookies ) {
		cookieString += setC.split( " " )[0] + " ";
	}
	parsedCoockies = cookieString;
};

const https = require( "https" );
const options = {
  hostname: "genericws.dev.smb.vzc-iot.com",
  port: 443,
  path: "/status",
  method: "GET"
};

const request = https.request( options, ( response ) => {
	//console.log( `statusCode: ${response.statusCode}` ); //if 200
	//console.dir( response.headers["set-cookie"] );
	//response.on( "data", data => {
	//	process.stdout.write( data );
	//} );
	if( response.statusCode === 200 ) {
		rawCookies = response.headers["set-cookie"];
		prepareCoockie();
	} else {
		console.error( `statusCode: ${response.statusCode}` );
		process.exit( 1 );
	}
});

request.on( "error", ( error ) => {
	console.error( error );
	process.exit( 1 );
} );

request.end();
return;
///////
//const socket = io( "http://localhost:9011", { // https is supported and can be used.
const socket = io( "https://genericws.dev.smb.vzc-iot.com:443", {
	path: "/ws-receiver", // listening path is configurable.
	query: {
		tocken: JWT
	},
	//transports: [ "websocket" ],
	//rejectUnauthorized: false // self-signed server cert,
	transportOptions: {
		polling: {
			extraHeaders: {
				"Cookie": "hello=world"
			}
		}
	}
} );

// 1) if the server cant validate the token it emit a "error" event an, immediatly after, close the soket.
// So client must listen to this events
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
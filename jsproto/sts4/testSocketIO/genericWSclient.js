"use strict";

const io = require( "socket.io-client" );

const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1ODY1MzU4MTQsImV4cCI6MTU4NjYyMjIxNCwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGE2ODYzMzY2YzUuZXUuZm0tY2xvdWQuY29tIiwiYXVkIjpbImh0dHBzOi8vdG9rZW4uc3RzdjQuNTBhNjg2MzM2NmM1LmV1LmZtLWNsb3VkLmNvbS9yZXNvdXJjZXMiLCJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImNsaWVudF9pZCI6Im1hc3RlciIsInN1YiI6IjkxMzI2N2I4LTU0MDUtNDk4ZC03NjE4LTA4ZDc2OWJiMWY4ZiIsImF1dGhfdGltZSI6MTU4NjUzNTgxNCwiaWRwIjoibG9jYWwiLCJyZXZlYWxfYWNjb3VudF9pZCI6IjEwMTUxMjciLCJyZXZlYWxfdXNlcl9pZCI6IjE1OTgwMjgiLCJyZXZlYWxfdXNlcl90eXBlX2lkIjoiMiIsInVuaXF1ZV9uYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx1Y2FzQFRFdGVzdC5jb20iLCJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwianRpIjoiNGJjMWI5Y2Q3Y2I5YjJkYThkMWIwOWJmMTQ1MzU0NTEiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImFtciI6WyJwd2QiXX0.N6x4r2tIURMT5tCngNZoolWPGpTIFkLLl04W0GkD3yX19VpBttvgiidYjsZGS6tzcfaPaOmftCBYQAS95Jg2I1i5VjmyRYXazE_neOOoXgkuq0TLmQui3UOdcfOe41qGGQW4lBJPFHjAchFzNGnfNny8UaTmJXFpsFhJpzlIXpWu1hQc7xn6X2XpeJb7OAa21adOSE9YapEPKPy4HzI1V4RZaDe9v4Krod5cfQXORkLquY6-Ba46e8iBeLXwMheC4G1U0jXnl0SbbhL8EExHtHlKtBO04VvC-fjESnlASmr1pemU8-rtqADxf7raKOLJLbcs8q7FMe5RAVkEiqjtpTMW6b63WsPWBbJ-TEk6mtpho-va3evovMdw1e5WKihgnxM-iJcOsvlB7IvMZ4g09X9oCLF-uo1iLep2U3hLsX_JIrKJcmUMjvgo9WcqRo3PixD4I6yEltlKLxi5SWirUfckVpr6vxZ8PNJQtZ_NgHCRfFke9rJjNg1mg6QQGhT4euFD3zZpK8pGh58miyixq-7j8zmcL_m96ma7W9_rSCZRZwVxgi6vr19yTZg6ua-Lql8dMtIbKUvsFdZLeNBtjC5uyyPcQnviq8vEX5b1Mwo4PpgNyDAZtT1jamnWmioyvqy7kYRwnaIb5OjDH-G8UJxvEfsXN8rjuf58z8HK69M";
const DATA_DELAY = 2500;

const socket = io( "http://localhost:9010", { // https is supported and can be used.
	path: "/ws-receiver", // listening path is configurable.
	query: {
		tocken: JWT
	},
	rejectUnauthorized: false // self-signed server cert,
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
	 		thingType: "20",
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
			stringId, //"Header.SequenceNumber",
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
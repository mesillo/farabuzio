"use strict";

const io = require( "socket.io-client" );

const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1ODY4ODMwMjIsImV4cCI6MTU4Njk2OTQyMiwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGE2ODYzMzY2YzUuZXUuZm0tY2xvdWQuY29tIiwiYXVkIjpbImh0dHBzOi8vdG9rZW4uc3RzdjQuNTBhNjg2MzM2NmM1LmV1LmZtLWNsb3VkLmNvbS9yZXNvdXJjZXMiLCJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImNsaWVudF9pZCI6Im1hc3RlciIsInN1YiI6IjkxMzI2N2I4LTU0MDUtNDk4ZC03NjE4LTA4ZDc2OWJiMWY4ZiIsImF1dGhfdGltZSI6MTU4Njg4MzAyMiwiaWRwIjoibG9jYWwiLCJyZXZlYWxfYWNjb3VudF9pZCI6IjEwMTUxMjciLCJyZXZlYWxfdXNlcl9pZCI6IjE1OTgwMjgiLCJyZXZlYWxfdXNlcl90eXBlX2lkIjoiMiIsInVuaXF1ZV9uYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx1Y2FzQFRFdGVzdC5jb20iLCJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwianRpIjoiNzAyMzhiZDMwZTEzZjlhNThkMDQ2ODBmM2Y0MzdjZDYiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImFtciI6WyJwd2QiXX0.GjnR7rxk_AqO3TWbsqQp6_s8Bnw-z60u-QwaJyPEgJxv4JPyvcjyusrKg1kJwkTaOGV8cJFK8vqnW8ObkAe14JON1fuI8khSYJWToDMa2zVmMpNonnGZZkqpO76h8vayJIeBvc0mobzjgzi0LbJ8qtyYLkQC5xg8JZvVdZ6Ma3L5gNaMY_4Dg6B72EwuVo-w7PErwdkqSnrYsKgFr7yj5VPKI3qWtbpttrqHsIfdj0XlzY9nRbAs-j2G8_7m9N732Cbn6UqP30XYsUxJmUG5QSlTgvBoKHXRdCZ_GbcKAkwpXs3KT1CxxKNeKh5BfBrtapSvtHlRa-IWoScn1Ob0LurytHabGrC75JFHJOr--JG4qnGvQFrf831Iptaikaqpyzt9t_Tz2uSDH-CwXXQz7MclitaD4AvetOFBMhpo9nZe7j0YnF1N3RrO9eOW5KQyrYz1SNv2UIv_otsDJBmCy8CYbouv3DvRV4oSza0fXTH9QEQJkBLjnPQvXEHe4oB7r9d-bOd6MMdH32GFp_xdZEsmrwH0pjuSVWIPoBklPEQBNnGKFgzN6-PiN_UtSMf-ROFHGzfSqsSyuDn0aHoZj754NWqi3_YnG8bC7lf7wWR3dNTTiggZB-vLqBu4F6eutl_Y7-Qs-3N1mWzP25EyfB9aG1Pd1jF-lu8pM36ggJQ";
const DATA_DELAY = 2500;

const socket = io( "http://localhost:9011", { // https is supported and can be used.
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
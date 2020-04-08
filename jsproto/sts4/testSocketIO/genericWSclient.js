"use strict";

const io = require( "socket.io-client" );

const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1ODYzNTg4NTMsImV4cCI6MTU4NjQ0NTI1MywiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGE2ODYzMzY2YzUuZXUuZm0tY2xvdWQuY29tIiwiYXVkIjpbImh0dHBzOi8vdG9rZW4uc3RzdjQuNTBhNjg2MzM2NmM1LmV1LmZtLWNsb3VkLmNvbS9yZXNvdXJjZXMiLCJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImNsaWVudF9pZCI6Im1hc3RlciIsInN1YiI6IjkxMzI2N2I4LTU0MDUtNDk4ZC03NjE4LTA4ZDc2OWJiMWY4ZiIsImF1dGhfdGltZSI6MTU4NjM1ODg1MywiaWRwIjoibG9jYWwiLCJyZXZlYWxfYWNjb3VudF9pZCI6IjEwMTUxMjciLCJyZXZlYWxfdXNlcl9pZCI6IjE1OTgwMjgiLCJyZXZlYWxfdXNlcl90eXBlX2lkIjoiMiIsInVuaXF1ZV9uYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx1Y2FzQFRFdGVzdC5jb20iLCJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwianRpIjoiZThkNDZkNzVmNmMzMjkwMTUwZjJkZDE4NDVhNjQ3MDMiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImFtciI6WyJwd2QiXX0.g25xLI-B33fENow4RSWcKxyTNE7FKDbxk_EZ-tuT2enAdINC4N3NbzoCXO04Ssb7dCWVSkyxl98ksHmZTpa7OW0NJtM4XuPKCCaErtVPdtG8yvNLSrqG7YPFwqG_SlJgCBYvxNItCQb2G7dPkWAjRvNIlEgrmrDtQ51pd8ObhalIR2azH83E_N8TEGLF4KJUVoSNmmL2p_eYFrfcHJa7xEPyXy0EFcaFVQXxBMz1UdJTDhQgt6BbamnnGCLaLRZqrOeHvLaJp964N5iMyKefsQqz3I3CNE6NOX4z9PIdDf21awwSSM6U9ZdgPkt0O5tzd1K3Ns_NzUreQ6s77kRlYd55Z_JtNkxRCkSnJkJ-_T3gzoPSlghsamnrFf4sMtVaprGHBw-dKVSOEsREIJ352Dj5ZaV9DLSnvvZFYiQrbEUOeCwRN7Yu56f13oR7drM-rBOY0gS-OPSPlHUCz24WTtfzuS9vmQjbMdwAzjflNjwPIMFZiQLEsNqU5TQdCxnwgCHpjNiPTQ-ezVR1ntIaRfYPUsYJpL0cmHCwAiA44GsEDyPxS-kOaRB_WxB_c2qqfLEHKHX3MAYXfxD96QWAbbEMZB5RRq1OvSxDLpe6ylDICFFXXj1Z__8vKIPIuRtOXIlXday5UtKvmKdfSsNBrFeU1F12dtZ2k7P77PSmWXE";
const DATA_DELAY = 2500;

const socket = io( "http://localhost:9010", { // https is supported and can be used.
	path: "/ws-receiver", // listening path is configurable.
	query: {
		tocken: JWT
	}
} );

/*
[
	"startSession",  {
	  thingType: "20",
	  clientProtocolVersion: "1",
	  id: "",
	  schema: {
		 position:{
			 dynamic: [
			 "Header.UpdateTime",
			 "Gps.Latitude",
			 "Gps.Longitude",
			 ....   
			 ],
			 static: {
				 "Mobile.OSVersion": 4,
				 "Mobile.AppName": 1,
				 ....
			 },
			 token: {
				 "reveal_user_id" : "Header.ThingId",
				 "reveal_user_id": "Header.AccountId",
				 ...
			 }
		 ...
		 }
	  }
	}
 ]
*/
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
			thingId: "00001",
	 		thingType: "20",
	 		os: "to-be-defined",
	 		osVersion: "to-be-defined",
	 		appName: "FSD",
	 		appVersion: "1",
	 		clientProtocolVersion: "1",
	 		schema: {
				position: [ // name of data schema.
					"Header.UpdateTime",
					"Header.AccountId",
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
					"Mobile.CorrelationId",
					"Mobile.DeviceType",
					"Mobile.DeviceId",
					"Mobile.OS",
					"Mobile.OSVersion",
					"Mobile.AppName",
					"Mobile.AppVersion"
				]
			},
			id: id.toString()
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
			123456, //"Header.AccountId",
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
			"idontknow", //"Mobile.CorrelationId",
			"devicetype", //"Mobile.DeviceType",
			"deviceid", //"Mobile.DeviceId",
			"adroid", //"Mobile.OS",
			"10", //"Mobile.OSVersion",
			"FSD", //"Mobile.AppName",
			"1" //Mobile.AppVersion"
		] },
		( event, payload ) => { // 5) check receiving
			if( event === "ack" && payload.id === stringId ) {
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
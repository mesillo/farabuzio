"use strict";

const io = require( "socket.io-client" );

//const JWT = ""; // the JWT token
//const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1ODQzNDYxNDYsImV4cCI6MTU4NDQzMjU0NiwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGE2ODYzMzY2YzUuZXUuZm0tY2xvdWQuY29tIiwiYXVkIjpbImh0dHBzOi8vdG9rZW4uc3RzdjQuNTBhNjg2MzM2NmM1LmV1LmZtLWNsb3VkLmNvbS9yZXNvdXJjZXMiLCJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImNsaWVudF9pZCI6Im1hc3RlciIsInN1YiI6IjkxMzI2N2I4LTU0MDUtNDk4ZC03NjE4LTA4ZDc2OWJiMWY4ZiIsImF1dGhfdGltZSI6MTU4NDM0NjE0NiwiaWRwIjoibG9jYWwiLCJyZXZlYWxfYWNjb3VudF9pZCI6IjEwMTUxMjciLCJyZXZlYWxfdXNlcl9pZCI6IjE1OTgwMjgiLCJyZXZlYWxfdXNlcl90eXBlX2lkIjoiMiIsInVuaXF1ZV9uYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx1Y2FzQFRFdGVzdC5jb20iLCJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwianRpIjoiYTM1ZjVhZDM2M2QzMTZjMzM4MDY0NzBhN2U4MTExMjMiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImFtciI6WyJwd2QiXX0.YoznSqT2pTr8HdtpqmYiN-0dsF4iBG7WSxr8gwz0JYAC4qb5-YEw9SMuPoLsF_GmNJbU6dNz7eBeIEyr-VID1ncP0pxRQLUjYiFeQyfPZAdG5eMsjD6qMmQjSn2SRHUXQQ-DIfx1nwt9xjcznkJ35f_91JyAcByaljXPT9EGUKK8jOZuw_l_fUBnLIFUtXSSbN9C1AAua986ZH7rnRTWTR5y2q0UDonio_tCvb9UPnBgDmDMcOWGEuqJW0pnuWUJYGjJ-BM8_cVIBDpoEH5HdUPPkB2HBCz2kakjU6IOsyXElQNBdvTmE-wxpBlryXLr5aadPaePxdWG6uakUq3bu6M3zu7wO8SUo7eG4LKu-u8Rd98EZ32vOB_HHpWHS0_Bj9SMGs1GnBexhgD9NlgwvJIcBPNrebQqlGN7G0SfPOOH040g_ERsOJ6-L8pi64C5ZJ_tweRHiesp31v_RLZWSl_eUMNQrc7gp6J_yB0LkaDs645RbTmiVoIXfKZ9ST7SMx-GYTKXj5wtywHt7yDdJiZibqO6kg1Gen_ZXS2JP_BkLltggcFTzzb1d_i6oESvNhvtnPXXaH4nDCsCArR0UO7y2KlaOap95JblZ7MpOFMJrjDyeDU_MchHFAQl3OvBnLP6tH-umJQTJ8BNUwauGm0LjNCv3BEXF0MD-92_qqY";
const JWT = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1ODYxNzgyNTgsImV4cCI6MTU4NjI2NDY1OCwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGE2ODYzMzY2YzUuZXUuZm0tY2xvdWQuY29tIiwiYXVkIjpbImh0dHBzOi8vdG9rZW4uc3RzdjQuNTBhNjg2MzM2NmM1LmV1LmZtLWNsb3VkLmNvbS9yZXNvdXJjZXMiLCJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImNsaWVudF9pZCI6Im1hc3RlciIsInN1YiI6IjkxMzI2N2I4LTU0MDUtNDk4ZC03NjE4LTA4ZDc2OWJiMWY4ZiIsImF1dGhfdGltZSI6MTU4NjE3ODI1OCwiaWRwIjoibG9jYWwiLCJyZXZlYWxfYWNjb3VudF9pZCI6IjEwMTUxMjciLCJyZXZlYWxfdXNlcl9pZCI6IjE1OTgwMjgiLCJyZXZlYWxfdXNlcl90eXBlX2lkIjoiMiIsInVuaXF1ZV9uYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx1Y2FzQFRFdGVzdC5jb20iLCJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwianRpIjoiODk0MGQxYTBhYTk0NWQxNWFiY2RhYmI1MjRkYzIxOTkiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImFtciI6WyJwd2QiXX0.Wc0g8CdY37gDnBY19ppAGje82Qgbm0VnnFbYfUSiISg1uPOy8qjus3udJ7SRLaESTCI7rrjGAO822-SH3qC0JgVSlaIUyMHQIBAKn-JqaDjgSwcy4GD6EM6e0Q8JtS_aKK50SsDouRV3ZCi1aWuOWzu_BK1r7OdPfTD9iJjV3VC6M5dvc9-sDPfpYS-xDAYwMkWSRVYWa5okvg5qKciagsZKLx1cIDWvDGnjPnQQadkzC2H49qkIy6B9cOL0RcuafZS3avnT1wMTylnd1kUDp2NnuoD-_39-SjrYg0LU5KUxv8oWCa65rRJcuvo6LQBW7_lRxMXv_6_Z8oQ0ryT30d3KEyxl76OSgJnCzZp7QJ99JLhdKHZOI0AX9AH8OK4h2N1MXxC9v2mIabJubPydjhyx-pLcupebPoffwTR1rqtec-AU9_eAldeBMN9JlccUP09x-RechsL2DBSqXjXIoxMJzx6u6YhZnqp66G1OaEQB6J49DijivQzFvf-k2Gs9vJNj_rBoHbnyvv1jVaFCo7dvrPSFmJgBJGGn4EMr72NIuCJIsgLRq3svuw0yWeNmyzw1U6zXcCLuYj_CimWEhO_chd2gdXlfdYS8oMw5oIf6Gb1ixaFMY4eYgxQ7jSAW5iO8929C3yg1oHNVPZZj3O5OmbKBYQjdyaFm5Dl-ZJA";
const DATA_DELAY = 2500;

const socket = io( "http://localhost:9010", { // https is supported and can be used.
	path: "/ws-receiver", // listening path is configurable.
	query: {
		tocken: JWT
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
			hingId: "xxx",
	 		thingType: "xxx",
	 		os: "",
	 		osVersion: "",
	 		appName: "",
	 		appVersion: "",
	 		clientProtocolVersion: "1",
	 		schema: {
				position: [ // name of data schema.
					"Header.UpdateTime",
					"Gps.Latitude",
					"Gps.Longitude"
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
			(new Date()).toISOString(),
			44.9877331,
			12.0287777
		] },
		( event, payload ) => { // 5) check receiving
			if( event === "ack" && payload.id === stringId ) {
				// packet acked
			} else if( event === "nack" ) {
				// packet nacked; retry o discard.
				console.error( payload.error );
				process.exit();
			}
			console.log( event );
			console.log( payload );
		} );
	} 
}

// 2) when the server validate the token the "connect" event is raised.
socket.on( "connect", () => {
	console.log( "== Connected to the server ==" );
	// 3) now client can emit a "startSession" event
	Messages.startSession( socket );
} );
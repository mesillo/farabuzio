﻿using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using SocketIOClient;

namespace genericClient
{
	class Program {
		private static SocketIO client;
		private static Task connected;
		public static async Task Main(string[] args) {
			//client = new SocketIO( "http://127.0.0.1:6001" ) {
				client = new SocketIO( "https://genericws.test.eu.smb.vzc-iot.com:443" ) {
				Path = "/ws-receiver",
				//Transports = new string[] { "websocket" },
				Parameters = new Dictionary<string, string> {
					{ "token", "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM5RDcxN0Y3QkI3RjE1QUEzMDBCNzRENTA0QzExRjA4REM4RjBBMUQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJPZGNYOTd0X0Zhb3dDM1RWQk1FZkNOeVBDaDAifQ.eyJuYmYiOjE1ODg2OTI5NzUsImV4cCI6MTU4ODc3OTM3NSwiaXNzIjoiaHR0cHM6Ly90b2tlbi5zdHN2NC41MGE2ODYzMzY2YzUuZXUuZm0tY2xvdWQuY29tIiwiYXVkIjpbImh0dHBzOi8vdG9rZW4uc3RzdjQuNTBhNjg2MzM2NmM1LmV1LmZtLWNsb3VkLmNvbS9yZXNvdXJjZXMiLCJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImNsaWVudF9pZCI6Im1hc3RlciIsInN1YiI6IjkxMzI2N2I4LTU0MDUtNDk4ZC03NjE4LTA4ZDc2OWJiMWY4ZiIsImF1dGhfdGltZSI6MTU4ODY5Mjk3NSwiaWRwIjoibG9jYWwiLCJyZXZlYWxfYWNjb3VudF9pZCI6IjEwMTUxMjciLCJyZXZlYWxfdXNlcl9pZCI6IjE1OTgwMjgiLCJyZXZlYWxfdXNlcl90eXBlX2lkIjoiMiIsInVuaXF1ZV9uYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imx1Y2FzQFRFdGVzdC5jb20iLCJuYW1lIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsIjoibHVjYXNAVEV0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwianRpIjoiNWU1NzNhNzYyMjkxNWY4NWRhMGY0MmRkNGJlMjBmMTEiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicmV2ZWFsIl0sImFtciI6WyJwd2QiXX0.ZY3a1F95Rsd3vLdOyWfrVCFpqm0vKsNImxwSd1a5_goWLOVa95tYp9wHg7vYEaFNy5g_MBidMP8wRRHYh7DUaK841fyjrHbSyemi2Vf2k4zKJJLwd6gqWKK9y_NcEzubZ0iKlJGRgm6hV2KO-HRAtHQMgUSgtjhFf38w_YxrLnA-SZ7YJEmaovb3i3JF2wGsWBqV8g_Izaa94U7Qs-OmhLZdioDIB9lkiTi50xLZ1Fnbp93-P_rJWHOUMCpFMsH_R6giPHWFtBwcAq87QoUHHmFOGl9fEWH-i2KLIR0UFFqzVYBq91r56cHyrZO1rE5ic0qz_xZNJT5tY_gVSLjDt1AL-lPGhkVeLNaC9flItomct0zjdPSR1UVd4lUVQB5oE6bSNuVacIBuVYfFahCCn9vCsZXBKrEBpsqLQapATcVLVefnaKKUPIQUSEZ76ZU7dNGMEBGxLarQOl79VOlgMziybx0erFClrN5Zmx0ihRORKSEHdTPzl0tX4M-aavZ_AA9JPLPFqqPmKboj8T5k9Z2rKu0s87qAqA5dfhQyeZiDOyjrk6JjkDWJ7253NCifxPcOcx4O-ERhTiJ3uMmLiaNi8x9ZkevwmGIFooHKESdGpGg2AdXmkSJk8eE37ad_Z9jIZk3HtTG2XwCus4-j2qdXmrpTCEpLDuWoAV7-ezg" }
				}
			};

			client.OnConnected += Client_OnConnected;
			await client.ConnectAsync();
			connected.Wait();

			Console.WriteLine( "Done!" );
		}

		private static void Client_OnConnected() {
			Console.WriteLine("Connected to server");
			connected = startSession();
		}

		private static Task startSession() {
			return client.EmitAsync( "startSession", new object[] {
		 		@thingType = 20,
				@clientProtocolVersion = "1",
				@id = "0", // TODO: manage ID...
		 		@schema = new object[] {
					@position = new object[] { // name of data schema.
						@dynamic = new string[] { // dynamic field to be populated with value in position messages.
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
						},
						//@static = new string[] { // static key: value added to all messages.
						//	"Mobile.DeviceType" = "static-devicetype",
						//	"Mobile.DeviceId" = "static-deviceid",
						//	"Mobile.OS" = "WednesdayOS",
						//	"Mobile.OSVersion" = "007",
						//	"Mobile.AppName" = "static-FSD",
						//	"Mobile.AppVersion" = "example"
						//},
						//token = new Dictionary<string, string>() { // Tocken info : standard decoded value to add on messages.
						//	"reveal_user_id" = "Header.ThingId",
						//	"reveal_account_id" = "Header.AccountId"
						//}
					}
				}
			},
			payload => {
				Console.WriteLine( "response" );
			} );
		}
	}
}

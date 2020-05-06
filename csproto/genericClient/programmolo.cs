private static void Client_OnConnected()
		{
			Console.WriteLine("Connected to server");
			Task t = client.EmitAsync("startSession", new object[] { GetStartSession(0) }, (ResponseArgs args) => Console.WriteLine($"{args.Text}"));
			t.Wait();
			Console.WriteLine("Handshake sent");
		}

		private static dynamic GetStartSession(int id)
		{
			return new
			{
				thingType = 20,
				clientProtocolVersion = "1",
				id = id.ToString(),
				schema = new {
					position = new { // name of data schema.
						dynamic = new string[]{ // dynamic field to be populated with value in position messages.
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
						@static = new Dictionary<string,string>(){ // static key: value added to all messages.
							{"Mobile.DeviceType","static-devicetype" },
							{"Mobile.DeviceId","static-deviceid" },
							{"Mobile.OS","WednesdayOS" },
							{"Mobile.OSVersion","007" },
							{"Mobile.AppName","static-FSD" },
							{ "Mobile.AppVersion","example" }
						},
						token = new { // Tocken info : standard decoded value to add on messages.
							reveal_user_id = "Header.ThingId",
							reveal_account_id = "Header.AccountId"
						}
					}
				}
			};
		}
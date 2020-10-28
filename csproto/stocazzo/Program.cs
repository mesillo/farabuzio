using System;

public class EdiContent
	{
		public int ThingType { get; set; }
		public string ProductID { get; set; }
		public string TopAssNo { get; set; }

		public string Esn { get; set; }

		public long Imei { get; set; }
		public long Imsi { get; set; }
		public long Iccid { get; set; }
		public string BluetoothAddress { get; set; }
		public string WifiSSID { get; set; }
		public string WifiPwd { get; set; }
		public string HumSystemId { get; set; }
		public string WifiMacAddress { get; set; }
		public string MobileModuleFWRevision { get; set; }

		public string AESKey { get; set; }
		public string SwRevision { get; set; }
		public string PomFWRevision { get; set; }
		public string Wifi5GHzMacAddress { get; set; }
		public string ProfileRevision { get; set; }
		public string TestStationId { get; set; }
		public string TestResult { get; set; }
		public string TestDate { get; set; }
		public string TestTime { get; set; }
		public string ManifactureSite { get; set; }
		public string PONumber { get; set; }
		public string ModelNumber { get; set; }
		public string HWRevision { get; set; }
		public string BluetoothDeviceName { get; set; }
		public string SWVersion { get; set; }
		public string MobileModuleFWVersion { get; set; }
		public string BluetoothMCUId { get; set; }
		public string BluetoothFWVersion { get; set; }
		public string ProfileRevisionNumber { get; set; }
	}

public class Program
{
	public static void Main()
	{
		var pippo = new EdiContent();
		//Console.WriteLine(pippo.WifiSSID);
		Console.WriteLine( $"{@pippo}" );
	}
}
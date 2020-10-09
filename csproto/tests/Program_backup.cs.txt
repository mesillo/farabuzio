using System;
using System.Linq;
using System.Collections.Generic;
//using Newtonsoft.Json;

class MainClass {
	
	protected const ushort UuidLen = 36;
	//protected const ushort POLY = 0x8408;

	public static void Main (string[] args) {
		string iso8601String = "2020-02-07T12:30:00.000Z";
		List<byte> dateBytes = getUnixTimeStamp( iso8601String );
		Console.WriteLine(
			String.Join("", BitConverter.ToString( dateBytes.ToArray() ).Split("-") )
		);
	//	Console.WriteLine( dateBytes );
	//	string uuid = "00000000-0000-0000-0000-000000000001";
	//	List<byte> uuidlist = UuidStringToBytes( uuid );
	//	Console.WriteLine( uuidlist.Count );
	//	Console.WriteLine( BitConverter.ToString( uuidlist.ToArray() ) );
	//	/*for( int i = 0 ; i < uuidlist.Count ; i++ ) {
	//		Console.Write( uuidlist[i] );
	//	}*/
	}

	//protected static string ToRfc3339String(DateTime dateTime) // TODO: to be tested.
	//{
	//	return dateTime.ToString("yyyy-MM-dd'T'HH:mm:ss.fffzzz", DateTimeFormatInfo.InvariantInfo);
	//}

	protected static List<byte> getUnixTimeStamp( string iso8601String ) {
		DateTime date = DateTime.ParseExact(iso8601String, "yyyy-MM-ddTHH:mm:ss.fffK", System.Globalization.CultureInfo.InvariantCulture);
		//UInt32 timeStamp = (UInt32) date.Subtract(DateTime.UnixEpoch).TotalSeconds;
		UInt32 timeStamp = (UInt32) date.ToUniversalTime().Subtract(DateTime.UnixEpoch).TotalSeconds;
		byte[] timeStampBytes = BitConverter.GetBytes( timeStamp );
		//Int32 timeStamp = (Int32) date.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
		//(Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
		//Console.WriteLine( timeStamp );
		return byteArrayToBigEndianList( timeStampBytes );
	}

	protected static List<byte> byteArrayToBigEndianList( byte[] input )
	{
		List<byte> output = new List<byte>();
		for (int i = (input.Length-1) ; i > -1 ; i--)
		{
			output.Add( input[i] );
		}
		return output;
	}

	protected static DateTime fromISO8601( string iso8601String )
	{
		return DateTime.ParseExact(iso8601String, "yyyy-MM-ddTHH:mm:ss.fffK", System.Globalization.CultureInfo.InvariantCulture);
		//return DateTime.Parse( iso8601String );
	}

	protected static List<byte> CalculateCRC( List<byte> buffer, ushort poly )
	{
		List<byte> returnValue = new List<byte>();
		ushort ucLen = (ushort) buffer.Count;
		ushort usCRC = 0;

		for (ushort i = 0; i < ucLen; i++)
		{
			usCRC ^= buffer[i];

			for (ushort ucBit = 0; ucBit < 8; ucBit++)
			{
				ushort ucCarry = (ushort) ( usCRC & 0x01 );
				usCRC >>= 1;
				if (ucCarry != 0)
				{
					usCRC ^= poly;
				}
			}
		}
		//return (usCRC & 0xFFFF);
		byte[] crc = BitConverter.GetBytes( usCRC );
		for ( ushort i = 0 ; i < crc.Length ; i++ )
		{
			returnValue.Add( crc[i] );
		}
		return returnValue;
	}

	protected static List<byte> wrapBuffer ( byte type, string uuid, List<byte> content )
	{
		List<byte> returnValue = new List<byte>() { type };
		returnValue = returnValue.Concat( UuidStringToBytes( uuid ) ).Concat( content ).ToList();
		return returnValue;
	}

	protected  static List<byte> UuidStringToBytes(string uuid)
	{
		List<byte> returnValue = new List<byte>();
		if (uuid.Length == UuidLen)
		{
			string hexUuid = String.Join("", uuid.Split('-'));
			for (ushort i = 0; i < hexUuid.Length; i += 2)
			{
				returnValue.Add(Convert.ToByte(hexUuid.Substring(i, 2), 16));
			}
		}
		return returnValue;
	}
	/*protected static List<byte> UuidStringToBytes ( string uuid )
	{
		List<byte> returnValue = new List<byte>();
		if ( uuid.Length == UuidLen )
		{
			string hexUuid = String.Join( "", uuid.Split( '-' ) );
			for ( ushort i = 0 ; i < hexUuid.Length ; i += 2 )
			{
				returnValue.Add( Convert.ToByte( hexUuid.Substring( i, 2 ), 16 ) );
			}
		}
		return returnValue;
	}*/
}
		//UInt32 testUint = 15;
		//byte[] output = BitConverter.GetBytes( testUint );
		//for (short i = 3 ; i > -1 ; i-- ) {
		//	Console.WriteLine( output[i] );
		//}
		//for( ushort i = 0 ; i < output.Length ; i++ )
		//{
		//	Console.WriteLine( output[i] );
		//}

		//ushort testUshort = 15;
		//byte[] output = BitConverter.GetBytes( testUshort ).Reverse();
		//for( ushort i = 0 ; i < output.Length ; i++ )
		//{
		//	Console.WriteLine( output[i] );
		//}
		//Console.WriteLine( "\tStart" );
		//List<byte> result = wrapBuffer(
		//	127,
		//	"3fa85f64-5717-4562-b3fc-2c963f66afa6",
		//	( new List<byte>() { 1, 2, 3 } )
		//);
		//Console.WriteLine( "\tConversion" );
		//Console.WriteLine( result.Count );
		//byte[] output = result.ToArray();
		//Console.WriteLine( result.Count );
		//Console.WriteLine( output.Length );
		/*for( ushort i = 0 ; i < output.Length ; i++ )
		{
			Console.WriteLine( output[i] );
		}*/
		//Console.WriteLine( "\tEnd" );

		//string JSON = @"{""TRUE"":true,""FALSE"":false}";
		//Dictionary<string, string> output = JsonConvert.DeserializeObject<Dictionary<string, string>>( JSON );
		//Console.WriteLine( output["TRUE"] == "true" );
		//Console.WriteLine( output["FALSE"] == "false" );
		//Console.WriteLine( "END" );
		//byte output = (byte) Convert.ToUInt16( "257" );
		//Console.WriteLine( output );
		//string iso8601String = "2019-11-18T11:08:02.890Z";
		//List<byte> timestamp = getUnixTimeStamp( iso8601String );
		//for ( int i = 0 ; i < timestamp.Count ; i++ )
		//{
		//	Console.WriteLine( timestamp[ i ] );
		//}
		//DateTime date = fromISO8601( iso8601String );
		//Console.WriteLine( date );
		//List<byte> testList = new List<byte>() { 1, 2, 3, 4, 5, 6, 7, 8 };
		//
		//List<byte> CRC = CalculateCRC( testList, POLY );
		//
		//for ( ushort i = 0 ; i < CRC.Count ; i++ )
		//{
		//	Console.WriteLine( CRC[i] );
		//}
using System;
using System.Linq;
using System.Collections.Generic;

class MainClass {
	protected const ushort UuidLen = 36;
	protected const ushort POLY = 0x8408;

	public static void Main (string[] args) {
		List<byte> testList = new List<byte>() { 1, 2, 3, 4, 5, 6, 7, 8 };
		
		List<byte> CRC = CalculateCRC( testList, POLY );

		for ( ushort i = 0 ; i < CRC.Count ; i++ )
		{
			Console.WriteLine( CRC[i] );
		}
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

	protected static List<byte> UuidStringToBytes ( string uuid )
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
	}
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
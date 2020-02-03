using System;
using System.Linq;
using System.Collections.Generic;

class MainClass {
	protected const ushort UuidLen = 36;

	public static void Main (string[] args) {
		Console.WriteLine( "\tStart" );
		List<byte> result = wrapBuffer(
			127,
			"3fa85f64-5717-4562-b3fc-2c963f66afa6",
			( new List<byte>() { 1, 2, 3 } )
		);
		Console.WriteLine( "\tConversion" );
		byte[] output = result.ToArray();
		//Console.WriteLine( result.Count );
		//Console.WriteLine( output.Length );
		for( ushort i = 0 ; i < output.Length ; i++ )
		{
			Console.WriteLine( output[i] );
		}
		Console.WriteLine( "\tEnd" );
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
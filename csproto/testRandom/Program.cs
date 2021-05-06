using System;
using System.Threading;
using System.Collections.Generic;
using Simulators.Utils;

namespace testRandom
{
	class Program
	{
		public const uint samplesNum = 1000000;
		public const int round = 6;
		static void Main(string[] args)
		{
			Dictionary<double, uint> latitudeMap = new Dictionary<double, uint>();
			//while( true ) {
			for( uint i = 0 ; i < samplesNum ; i++ ) {
				// Console.WriteLine( Math.Round( CoordinateGenerator.getLatitude(), 6 ) );
				double latitude = Math.Round( CoordinateGenerator.getLatitude(), round );
				//double latitude = CoordinateGenerator.getLatitude();
				if( ! latitudeMap.ContainsKey( latitude ) ) {
					latitudeMap.Add( latitude, 1 );
				} else {
					latitudeMap[latitude] += 1;
				}
				//Thread.Sleep( 250 ); 
			}
			//Console.WriteLine( latitudeMap );
			uint latCount = 0;
			uint latMaxTimes = 1;
			foreach( KeyValuePair<double, uint> latitudeOccurrence in latitudeMap ) {
				if( latitudeOccurrence.Value > 1 ) {
					//Console.WriteLine( "{0} -> {1}", latitudeOccurrence.Value, latitudeOccurrence.Key );
					latCount++;
					if( latitudeOccurrence.Value > latMaxTimes ) {
						latMaxTimes = latitudeOccurrence.Value;
					}
				}
			}
			Console.WriteLine( "Latitude Samples: {0}", samplesNum );
			Console.WriteLine( "Duplicated values: {0}", latCount );
			Console.WriteLine( "Max duplicated times: {0}", latMaxTimes );
		}
	}
}

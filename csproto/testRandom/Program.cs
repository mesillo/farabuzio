using System;
using System.Threading;
using System.Collections.Generic;
using Simulators.Utils;

namespace testRandom
{
	class Program
	{
		public const uint samplesNum = 2147483648;
		public const uint checkPoint = 100000;
		public const int round = 6;
		static void Main(string[] args)
		{
			//latitudeTest();
			//allCoordinatesGeneration( "\t" );
			//allCoordinatesGeneration( "|" );
			testFullCoordinates( samplesNum );
		}
		static void allCoordinatesGeneration( string separator ) {
			for( uint i = 0 ; i < samplesNum ; i++ ) {
				Console.WriteLine( getCoordinate( separator ) );
			}
		}
		static string getCoordinate( string separator ) {
			double latitude = Math.Round( CoordinateGenerator.getLatitude(), round );
			double longitude = Math.Round( CoordinateGenerator.getLongitude(), round );

			return string.Format( "{0}{2}{1}", latitude, longitude, separator );
		}
		static void testFullCoordinates( uint samplesNum ) {
			Dictionary<string, uint> map = new Dictionary<string, uint>();
			for( uint i = 0 ; i < samplesNum ; i++ ) {
				string coordinateString = getCoordinate( "|" );
				if( ! map.ContainsKey( coordinateString ) ) {
					map.Add( coordinateString, 1 );
				} else {
					map[coordinateString] += 1;
				}
				if( i % checkPoint == 0 ) {
					Console.WriteLine( " ===== {0} ===== ", i );
					foreach( KeyValuePair<string, uint> sample in map ) {
						if( sample.Value > 1 ) {
							Console.WriteLine( "{0} -> {1}", sample.Value, sample.Key );
						}
					}
				}
			}
			Console.WriteLine( " ===== DONE ===== " );
			foreach( KeyValuePair<string, uint> sample in map ) {
				if( sample.Value > 1 ) {
					Console.WriteLine( "{0} -> {1}", sample.Value, sample.Key );
				}
			}
		}
		static void latitudeTest() {
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

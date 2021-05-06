using System;

namespace Simulators.Utils
{
	static class CoordinateGenerator
	{
		private static readonly double MIN_LATITUDE = 43.69064444988243;
		private static readonly double MAX_LATITUDE = 50.58981994995728;
		private static readonly double MIN_LONGITUDE = -2.4593354173687616;
		private static readonly double MAX_LONGITUDE = 65.1719118769574;
		//private static readonly double MIN_LATITUDE = -90;
		//private static readonly double MAX_LATITUDE = 90;
		//private static readonly double MIN_LONGITUDE = -180;
		//private static readonly double MAX_LONGITUDE = 180;
		private static readonly Random random = new Random();
		public static double getLatitude()
		{
			return MIN_LATITUDE + ( random.NextDouble() * ( MAX_LATITUDE - MIN_LATITUDE ) );
		}
		public static double getLongitude()
		{
			return MIN_LONGITUDE + ( random.NextDouble() * ( MAX_LONGITUDE - MIN_LONGITUDE ) );
		}
	}
}
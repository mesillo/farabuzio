#ifndef _RPMCNT_HEADERS_
#define _RPMCNT_HEADERS_

#include <Arduino.h>

#define _RPMCNT_DEFAULT_MODE_ RISING
#define _RPMCNT_DEFAULT_PIN_ 2 // For UNO board

#define RPMCNT_UNAVAILABLE -1

#define _HZ_TO_RPM_ 60
#define _RPMCNT_MICROS_INVALID_VALUE_ 0
#define _RPMCNT_MAX_PERIOD_ 200000 // 3 * 15 Hz period

class RpmCnt {
	private:
		static volatile unsigned long prevMicros;
		static volatile long period;
		static unsigned int pNm;
		static unsigned int md;
		static bool enabled;

		static void getPeriod( void );

	public:
		static void init( void ); // TODO: is it needed?
		static void enable( void );
		static void setPin( unsigned int );
		static void setMode( unsigned int );
		static void disable( void );
		static void reset( void );
		static float getFrequency( void );
		static int getRPM( void );
};

#endif
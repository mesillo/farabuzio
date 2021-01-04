#ifndef _RPMCOUNTER_HEADERS_
#define _RPMCOUNTER_HEADERS_

#include <Arduino.h>

#define _RPMCOUNTER_DEFAULT_MODE_ RISING
#define _RPMCOUNTER_DEFAULT_PIN_ 2 // For UNO board

class RpmCounter {
	private:
		static volatile unsigned int count;
		static unsigned int pNm;
		static unsigned int md;
		static bool enabled;
		static unsigned long strTm;

		static void doCount( void );

	public:
		static void init( void ); // TODO: is it needed?
		static void enable( void );
		static void setPin( unsigned int );
		static void setMode( unsigned int );
		static void disable( void );
		static void reset( void );
		static unsigned int getCount( void );
		static float getFrequency( void );
};

#endif
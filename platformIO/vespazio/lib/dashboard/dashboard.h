#ifndef _VESPAZIO_DASHBOARD_
#define _VESPAZIO_DASHBOARD_

#include <SPI.h>
#include <U8x8lib.h>

#define _DASH_OLED_FONT_ u8x8_font_courR24_3x4_n
#define _DASH_OLED_POSITION_ 2,3
#define _DASH_OLED_CLEAR_ "        "

class dashboard {
	private:
		static unsigned int RPM;

		static void visualizeRPM( void );
		static void oledPrint( int );

	public:
		static void begin( void );
		static void setRPM( unsigned int );
};

#endif
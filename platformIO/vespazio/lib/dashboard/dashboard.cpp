#include <SPI.h>
#include <U8x8lib.h>

#include "dashboard.h"

U8X8_SSD1306_128X64_NONAME_HW_I2C u8x8( U8X8_PIN_NONE );

unsigned int dashboard::RPM = 0;

void dashboard::visualizeRPM( void ) {
	dashboard::oledPrint( dashboard::RPM );
}

void dashboard::oledPrint( int value ) {
	u8x8.drawString( _DASH_OLED_POSITION_, _DASH_OLED_CLEAR_ );
	u8x8.setCursor( _DASH_OLED_POSITION_ );
	u8x8.print( value );
}

void dashboard::begin( void ) {
	u8x8.begin();
	u8x8.setFont( _DASH_OLED_FONT_ );
}

void dashboard::setRPM( unsigned int RPM ) {
	if( RPM != dashboard::RPM ) {
		dashboard::RPM = RPM;
		dashboard::visualizeRPM();
	}
}
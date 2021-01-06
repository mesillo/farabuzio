#include <SPI.h>
#include <U8x8lib.h>

#include "dashboard.h"

U8X8_SSD1306_128X64_NONAME_HW_I2C oledDisplay( U8X8_PIN_NONE );

unsigned int dashboard::RPM = 0;

void dashboard::visualizeRPM( void ) {

}

void dashboard::setRPM( unsigned int RPM ) {
	if( RPM != dashboard::RPM ) {
		dashboard::RPM = RPM;
		dashboard::visualizeRPM();
	}
}
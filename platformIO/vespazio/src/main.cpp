#include <Arduino.h>

#include <SPI.h>
#include <U8x8lib.h>

//#include <rpmCounter.h>
#include <rpmCnt.h>

#define PINTONE 8
#define PINFREQUENCY 400 // 16 <-> 200 Hz : 1000 <-> 12000 RPM (tone() low limit 31Hz)

int prevFreq = RPMCNT_UNAVAILABLE;
//int prevRpm = RPMCOUNTER_UNAVAILABLE;
int prevRpm = RPMCNT_UNAVAILABLE;

U8X8_SSD1306_128X64_NONAME_HW_I2C u8x8( U8X8_PIN_NONE );

void setup() {
	Serial.begin( 9600 );
	u8x8.begin();
	u8x8.setFont(u8x8_font_courR24_3x4_n);
	// RpmCounter::init();
	// RpmCounter::enable();
	RpmCnt::init();
	RpmCnt::enable();

	tone( PINTONE, PINFREQUENCY );
}

void loop() {
	/*int rpm = RpmCnt::getRPM();
	if( rpm != prevRpm && rpm != RPMCNT_UNAVAILABLE ) {
		prevRpm = rpm;
		Serial.println( rpm );
	}*/
	int freq = (int) RpmCnt::getFrequency();
	if( freq != prevFreq && freq != -1 ) {
		prevFreq = freq;
		u8x8.drawString( 2, 3,"        " );
		u8x8.setCursor( 2, 3 );
		u8x8.print( freq );
		delay( 125 );
		Serial.println( freq );
	}
	//////////////////////////////////////////
	// int rpm = RpmCounter::getRPM();
	// if( rpm != prevRpm && rpm != RPMCOUNTER_UNAVAILABLE ) {
	// 	prevRpm = rpm;
	// 	Serial.println( rpm );
	// }
	//////////////////////////////////////////
	// float freq = RpmCounter::getFrequency();
	//int freq = (int) RpmCounter::getFrequency();
	//if( freq != prevFreq && freq != -1 ) {
	//	prevFreq = freq;
	//	Serial.println( freq );
	//}
}
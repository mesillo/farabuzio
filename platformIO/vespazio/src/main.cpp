#include <Arduino.h>

#include <timerazio.h>
#include <rpmCounter.h>

/// TIMER ///
Timerazio tmz = Timerazio( 1000 );
bool toggle( void ) {
		static bool status = LOW;
		status = ! status;
		return status;
}
void handlerFn( void ) {
		digitalWrite( LED_BUILTIN, toggle() );
}
/////////////

unsigned int prevCount = 0;

void setup() {
	/// TIMER ///
	pinMode( LED_BUILTIN, OUTPUT );
	tmz.setHandler( &handlerFn );
	tmz.start();
	/////////////
	Serial.begin( 9600 );

	RpmCounter::init();
}

void loop() {
	/// TIMER ///
	tmz.loop();
	/////////////
	unsigned int count = RpmCounter::getCount();
	if( count != prevCount ) {
		prevCount = count;
		Serial.println( count );
	}
}
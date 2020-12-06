#include <Arduino.h>
#include <timerazio.h>

Timerazio tmz = Timerazio( 1000 );

bool toggle( void ) {
	static bool status = LOW;
	status = ! status;
	return status;
}

void handlerFn( void ) {
	digitalWrite( LED_BUILTIN, toggle() );
}

void setup( void ) {
	Serial.begin( 9600 );
	pinMode( LED_BUILTIN, OUTPUT );
	tmz.setHandler( &handlerFn );
	tmz.start();
}

void loop( void ) {
	if( tmz.loop() ) {
		Serial.print( "." );
	}
}
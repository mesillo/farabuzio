#include <Arduino.h>
#include <eventazio.h>

#define INTERVAL 250

Eventazio evz = Eventazio();

bool toggle( void ) {
	static bool status = LOW;
	status = ! status;
	return status;
}

void handlerFn( void ) {
	digitalWrite( LED_BUILTIN, toggle() );
}

void setup() {
	Serial.begin( 9600 );
	pinMode( LED_BUILTIN, OUTPUT );
	evz.on( "blink", handlerFn );
}

void loop() {
	evz.emit( "blink" );
	delay(INTERVAL);
}
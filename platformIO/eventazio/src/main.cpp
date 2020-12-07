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

String *pippo;
void setup() {
	Serial.begin( 9600 );
	// delay( 3000 );
	pinMode( LED_BUILTIN, OUTPUT );
	evz.on( "blink", handlerFn );


	pippo = new String( "pippo" );
	Serial.println( "Setup done..." );
}

void loop() {
	evz.emit( "blink" );
	// Serial.println( "Emitted" );
	// Serial.println( pippo->charAt(0) );
	delay(INTERVAL);
}
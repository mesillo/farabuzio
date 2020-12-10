#include <Arduino.h>
#include <eventazio.h>

#define INTERVAL 1000

bool setupDone = false;
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
	//delay( 3000 );
	pinMode( LED_BUILTIN, OUTPUT );
	evz.on( "blink", handlerFn );
	//delay( 3000 );
	Serial.println( "Setup done..." );
}

void loop() {
	//if( ! setupDone ) {
	//	evz.on( "blink", handlerFn );
	//	setupDone = true;
	//	Serial.println( "setup" );
	//}
	evz.emit( "blink" );
	//handlerFn();
	Serial.println( "Emitted" );
	delay(INTERVAL);
}
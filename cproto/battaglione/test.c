#include <stdio.h>

#define ASCII_ZERO 48;

void getchararray( unsigned char byte, char* output ) {
	unsigned char value = byte;
	__int8_t i = 2;
	while( value ) {
		unsigned char number = value % 10;
		output[i--] = number + ASCII_ZERO;
		value = ( value - ( value % 10) ) / 10;
	}
	while( i > -1 ) {
		output[ i-- ] = ASCII_ZERO;
	}
}

void runtest( unsigned char number ) {
	char value[4];
	value[3] = '\0';

	getchararray( number, value );
	printf( "%u => %s\n", number, value );
}

int main(void) {
	runtest( 255 );
	runtest( 0 );
	runtest( 123 );
	runtest( 14 );
	runtest( 1 );
}
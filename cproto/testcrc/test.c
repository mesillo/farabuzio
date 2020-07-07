#include <stdio.h>
#include <string.h>
#include <malloc.h>
#include <stdint.h>
#include <stdbool.h>
#include <assert.h>

#define POLY 0x8408

typedef struct buffer {
	uint8_t* bytes;
	size_t size;
} buffer_t;

//const char* hexString = "01 0000001E 02 0005 C1B4381309B44870B5582455CA981240 5E0C90C8000A010180D861\0";
const char* hexUploadVideo = "010000001E020005C1B4381309B44870B5582455CA9812405E0C90C8000A01018061D8\0";

buffer_t getBufferFromHex( const char* hex );
void decimalPrintBuffer( buffer_t buffer );
bool checkCRC( buffer_t buffer );
uint8_t* reverseEndiannes( uint8_t* buffer, size_t len );

void parseUploadVideo( const char* hexPkt );

unsigned short crc16( uint8_t* buffer, unsigned short ucLen );

int main() {
	//buffer_t buffer = getBufferFromHex( hexString );
	//decimalPrintBuffer( buffer );
	//assert( checkCRC( buffer ) );
	printf( "Parse UploadVideo: %s\n", hexUploadVideo );
	parseUploadVideo( hexUploadVideo );
	printf( "\n=== END ===\n" );
	return 0;
}

void parseUploadVideo( const char* hexPkt ) {
	buffer_t packet = getBufferFromHex( hexPkt );
	assert( checkCRC( packet ) );
	uint8_t protocolVersion = packet.bytes[0];
	printf( "ProtocolVerison: %d\n", protocolVersion );
	uint32_t messageLength;
	memcpy( (void*)&messageLength, (void*) reverseEndiannes( packet.bytes + 1, 4 ), 4 );
	printf( "MessageLength: %d\n", messageLength );
	uint8_t packageType = packet.bytes[5];
	printf( "PackageType: %d\n", packageType );
	printf( "= Payload =\n" );
	uint16_t commandTypeId;
	memcpy( (void*)&commandTypeId, (void*) reverseEndiannes( packet.bytes + 6, 2 ), 2 );
	printf( "CommandTypeId: %d\n", commandTypeId );
	unsigned __int128 correlationId; //__int128 is a GCC defined type...
	memcpy( (void*)&correlationId, (void*) reverseEndiannes( packet.bytes + 8, 16 ), 16 );
	printf( "CorrelationId: %u\n", correlationId );
	
}

bool checkCRC( buffer_t buffer ) {
	unsigned short calculatedCRC = crc16( buffer.bytes, buffer.size-2 );
	unsigned short readedCRC = 0x0000 | ( buffer.bytes[ buffer.size - 2 ] << 8 | buffer.bytes[ buffer.size - 1 ] );
	//printf( "%x\n", calculatedCRC );
	//printf( "%x\n", readedCRC );
	return ( calculatedCRC == readedCRC );
}

buffer_t getBufferFromHex( const char* hex ) {
	size_t sizeHex = strlen( hex );
	assert( ( sizeHex % 2 ) == 0 );
	uint8_t* bytes = (uint8_t*) malloc( sizeHex / 2 );
	size_t i;
	for( i = 0 ; i < sizeHex / 2 ; i++ ) {
		sscanf( hex + (i*2) , "%2hhx", bytes + i );
	}
	buffer_t buffer;
	buffer.bytes = bytes;
	buffer.size = sizeHex / 2;
	return buffer;
}

void decimalPrintBuffer( buffer_t buffer ) {
	size_t i;
	for( i = 0 ; i < buffer.size ; i++ ) {
		printf( "%d ", buffer.bytes[ i ] );
	}
	printf( "\n" );
}

unsigned short crc16( uint8_t* buffer, unsigned short ucLen ) {
	unsigned short usCRC = 0x0000;

	for( unsigned short i = 0 ; i < ucLen ; i++ ) {
		usCRC ^= buffer[i];

		for( unsigned short ucBit = 0 ; ucBit < 8 ; ucBit++ ) {
			unsigned short ucCarry = ( unsigned short )( usCRC & 0x0001 );
			usCRC >>= 1;
			if( ucCarry != 0 ) {
				usCRC ^= POLY;
			}
		}
	}
	return usCRC;
	//unsigned short returnValue = 0x0000 | ( ( 0x00FF & usCRC ) << 8 ) | ( ( 0xFF00 & usCRC ) >> 8 );
	///return returnValue;
}

uint8_t* reverseEndiannes( uint8_t* buffer, size_t len ) {
	uint8_t* output = (uint8_t*) malloc( len );
	size_t i;
	for( i = 0 ; i < len ; i++ ) {
		output[i] = buffer[ len-( 1 + i ) ];
		//printf( "%d = %d => %d\n", i, len-( 1 + i ), buffer[ len-( 1 + i ) ] );
	}
	return output;
}
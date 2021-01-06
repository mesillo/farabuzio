#include <Arduino.h>
#include <SPI.h>
#include <U8x8lib.h>

/* Constructor */
//U8X8_SSD1306_128X64_NONAME_2ND_HW_I2C u8x8();
U8X8_SSD1306_128X64_NONAME_HW_I2C u8x8( U8X8_PIN_NONE ); // trick; use default parameter
//U8X8_SSD1306_128X64_NONAME_4W_SW_SPI u8x8(/* clock=*/ 13, /* data=*/ 11, /* cs=*/ 10, /* dc=*/ 9, /* reset=*/ 8);

/* u8x8.begin() is required and will sent the setup/init sequence to the display */
void setup(void)
{
	u8x8.begin();
	u8x8.setFont(u8x8_font_courR24_3x4_n);
}

void loop(void)
{
	//u8x8.setFont(u8x8_font_courB18_2x3_f);
	//u8x8.setFont(u8x8_font_courR24_3x4_f);
	//u8x8.drawString(3,3,"1000");
	u8x8.drawString(2,3,"1000");
	delay(1000);
	//u8x8.drawString(3,3,"9999");
	u8x8.drawString(2,3,"9999");
	delay(1000);

	// u8x8.drawString(3,3,"Hello World!");
	// delay(1000);
	// u8x8.drawString(3,3,"  Dio can!  ");
	// delay(1000);
}
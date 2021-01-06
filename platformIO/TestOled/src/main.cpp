#include <Arduino.h>
#include <SPI.h>
#include <U8x8lib.h>

/* Constructor */
U8X8_SSD1306_128X64_NONAME_HW_I2C u8x8( U8X8_PIN_NONE ); // trick; use default parameter

/* u8x8.begin() is required and will sent the setup/init sequence to the display */
void setup(void)
{
	u8x8.begin();
	u8x8.setFont(u8x8_font_courR24_3x4_n);
}

void loop(void)
{
	u8x8.drawString(2,3,"1000");
	delay(1000);
	u8x8.drawString(2,3,"9999");
	delay(1000);
}
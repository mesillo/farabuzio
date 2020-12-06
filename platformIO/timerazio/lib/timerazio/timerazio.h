#ifndef _TIMERAZIO_MAIN_CLASS_
#define _TIMERAZIO_MAIN_CLASS_

typedef void (*tmzHandlerFn)();

class Timerazio {
	private:
		unsigned long millisPeriod;
		unsigned long lastTick;
		bool armed;
		tmzHandlerFn handlerFn;

		void init( unsigned long );
	public:
		Timerazio( unsigned long );
		void setPeriod( unsigned long );
		void start( void );
		void stop( void );
		bool isElapsed( void );
		void reload( void );
		bool check( void );
		void setHandler( tmzHandlerFn );
		bool loop( void );
		void reset( void );
};

#endif
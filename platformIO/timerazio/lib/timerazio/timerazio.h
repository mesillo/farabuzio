#define _DEFAULT_TIMERAZIO_MILLISPERIOD_ 1000

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
		void start();
		void stop();
		bool isElapsed();
		void reload();
		bool check();
		void setHandler( tmzHandlerFn );
		bool loop();
};
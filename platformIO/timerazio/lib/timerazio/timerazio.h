#define _DEFAULT_TIMERAZIO_MILLISPERIOD_ 1000

class Timerazio {
	private:
		unsigned long millisPeriod;
		unsigned long lastTick;
		bool armed;
		void ( *handlerFn )();

		void init( unsigned long );
		//Timerazio();
	public:
		Timerazio( unsigned long );
		//Timerazio() override;
		void setPeriod( unsigned long );
		void start();
		void stop();
		bool isElapsed();
		void reload();
		bool check();
		void setHandler( void ( *handler )() );
		bool loop();
};
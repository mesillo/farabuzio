#ifndef _TIMERAZIO_MAIN_CLASS_
#define _TIMERAZIO_MAIN_CLASS_

/**
 * Type for Timer Handler function (no params and no return)
 */
typedef void (*tmzHandlerFn)();

class Timerazio {
	private:
		unsigned long millisPeriod;
		unsigned long lastTick;
		bool armed;
		tmzHandlerFn handlerFn;

		void init( unsigned long );
	public:
		/**
		 * Constructor
		 * @param unsigned long the millis of Timer Period.
		 */
		Timerazio( unsigned long );
		/**
		 * Set the Timer Period in millis
		 * @param unsigned long the millis of Timer Period.
		 * @return void
		 */
		void setPeriod( unsigned long );
		/**
		 * Start the Timer (load it)
		 * @param void
		 * @return void
		 */
		void start( void );
		/**
		 * Stop the Timer (never elapses)
		 * @param void
		 * @return void
		 */
		void stop( void );
		/**
		 * Check if Timer Period is Elapsed (since start or reload)
		 * @param void
		 * @return bool true Timer Period is elapsed
		 */
		bool isElapsed( void );
		/**
		 * Reload the timer.
		 * @params void
		 * @return void
		 */
		void reload( void );
		/**
		 * Check if Timer Period is Elapsed and Reload (restart) it
		 * @param void
		 * @return bool true Timer Period is elapsed
		 */
		bool check( void );
		/**
		 * Set the Timer Handler to be executed on loop invocation
		 * @param tmzHandlerFn the Timer Handler function
		 * @return void
		 */
		void setHandler( tmzHandlerFn );
		/**
		 * Check if Timer Period is Elapsed, Reload (restart) it and execute (if it is set) the Timer Handler function
		 * @param void
		 * @return bool true Timer Period is elapsed
		 */
		bool loop( void );
		/**
		 * Reset the timer to the initial status (not started and no Timer Handler set) with the current Timer Period value
		 * @param void
		 * @return void
		 */
		void reset( void );
};

#endif
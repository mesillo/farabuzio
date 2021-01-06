#ifndef _VESPAZIO_DASHBOARD_
#define _VESPAZIO_DASHBOARD_

class dashboard {
	private:
		static unsigned int RPM;

		static void visualizeRPM( void );

	public:
		static void setRPM( unsigned int RPM );
}

#endif
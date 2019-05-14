const DEFAULT_IDENTIFICATION_STRING : string = "GENERIC_APPLICATION_ERROR";
const DEFAULT_LOG_LEVEL : string = "info";

class ApplicationError extends Error {
	private reason : Error | null = null;
	private itentificationString : string = DEFAULT_IDENTIFICATION_STRING;
	private logLevel : string = DEFAULT_LOG_LEVEL;
	constructor( message : string, reason : Error | null = null ) {
		super( message );
		this.setReason( reason );
		this.setItentificationString( DEFAULT_IDENTIFICATION_STRING );
		this.setLogLevel( DEFAULT_LOG_LEVEL );
	}

	public getIdentificationString() : string {
		return this.itentificationString;
	}

	public setItentificationString( itentificationString : string ) : ApplicationError {
		this.itentificationString = itentificationString;
		return this;
	}

	public setReason( reason : Error | null ) : ApplicationError {
		this.reason = reason;
		return this;
	}

	public getReason() : Error | null {
		return this.reason;
	}

	public getReasonMessage() : string {
		let returnValue : string = "Application Error.";
		if( this.reason ) {
			returnValue = this.reason.message;
		}
		return returnValue;
	}

	public getLogLevel() : string {
		return this.logLevel;
	}

	public setLogLevel( logLevel : string ) : ApplicationError {
		this.logLevel = logLevel;
		return this;
	}

	public getReasonStack() : string {
		if( this.reason ) {
			return this.reason.stack ? this.reason.stack : "";
		}
		return "";
	}

	public getErrorClass() : string {
		return this.constructor.name;
	}

	public log( level : string | null = null ) : void {
		if( ! level ) {
			level = this.getLogLevel();
		}
		console.log( `${level}: ${this.getIdentificationString()} :: ${this.message}` );
	}
}

export { ApplicationError };
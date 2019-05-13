const DEFAULT_IDENTIFICATION_STRING : string = "";

class ApplicationError extends Error {
	private reason : Error | null;
	private itentificationString : string;
	constructor( message : string, reason : Error | null = null ) {
		super( message );
		this.setReason( reason );
		this.setItentificationString( DEFAULT_IDENTIFICATION_STRING );
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

	public getReasonStack() : string {
		if( this.reason ) {
			return this.reason.stack;
		}
		return "";
	}
}

export { ApplicationError };
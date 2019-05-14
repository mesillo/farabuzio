import { ApplicationError } from "./ApplicationError";

const DEFAULT_IDENTIFICATION_STRING : string = "GENERIC_RMQ_ERROR";

class RMQApplicationError extends ApplicationError {
    constructor( message : string, reason : Error | null = null ) {
		super( message, reason );
		this.setItentificationString( DEFAULT_IDENTIFICATION_STRING );
	}
}

export { RMQApplicationError, ApplicationError };
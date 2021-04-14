import AWS from "aws-sdk";
import { promisify } from "util";

const doTest = async () => {
	const options = {
		httpOptions: {
			timeout: 10000
		}
	};
	const metadataService = new AWS.MetadataService( options );
	const requestAsync = promisify( metadataService.request );
	try {
		const startRequestTime = process.hrtime();
		const response = await requestAsync("/latest/meta-data/instance-id");
		const endRequestTime = process.hrtime( startRequestTime );
		console.log( `HealthCheck instance-id request completed in: ${endRequestTime[0]}sec + ${endRequestTime[1] / 1000000}ms` );
		console.dir( response );
	} catch( error ) {
		console.error( "=== ERROR ===" );
		console.error( error );
	}
};

doTest();

//export default class HealthCheck {
//	private healthCheckStats: IStats = {
//		consecutiveFailuresCount: 0
//	};
//	private readonly maxConsecutiveFailures: number;
//	private readonly requestTimeout: number;
//
//	constructor(maxConsecutiveFailures: number, requestTimeout: number) {
//		this.maxConsecutiveFailures = maxConsecutiveFailures;
//		this.requestTimeout = requestTimeout;
//	}
//
//	public async check(): Promise<void> {
//		const options = {
//			httpOptions: {
//				timeout: this.requestTimeout
//			}
//		};
//		const metadataService = new AWS.MetadataService(options);
//
//		const requestAsync = promisify<string, string>(metadataService.request);
//		try {
//			console.dir( options );
//			const startRequestTime = process.hrtime();
//			await requestAsync("/latest/meta-data/instance-id");
//			const endRequestTime = process.hrtime( startRequestTime );
//			IoTLogger.info( `HealthCheck instance-id request completed in: ${endRequestTime[0]}sec + ${endRequestTime[1] / 1000000}ms` );
//			this.healthCheckStats.lastSuccessfulHealthCheck = new Date();
//			this.healthCheckStats.consecutiveFailuresCount = 0;
//		}
//		catch( error ) {
//			this.healthCheckStats.consecutiveFailuresCount++;
//			this.healthCheckStats.lastFailure = new Date();
//			IoTLogger.error( error );
//			IoTLogger.warn("", {
//				message: `Unable to retreive instance-id during HealthCheck`,
//				healthCheck: this.healthCheckStats
//			});
//		}
//		finally {
//			if (this.healthCheckStats.consecutiveFailuresCount >= this.maxConsecutiveFailures) {
//				IoTLogger.error("", {
//					message: `Max consecutive failures reached. Shutting down`,
//					maxConsecutiveFailures: this.maxConsecutiveFailures,
//					healthCheck: this.healthCheckStats
//				});
//				process.exit(1);
//			}
//		}
//	}
//}

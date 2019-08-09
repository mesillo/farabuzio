"use strict"

const baseRecordStruct = {
	eventID: "shardId-000000000000:49595160041073623401520312716573683571199835999744032770",	//unmanaged
	eventSourceARN: "arn:aws:kinesis:us-east-1:000000000000:stream/test-stream",	//unmanaged
	kinesis: {
		partitionKey: "48748",	//unmanaged
		data: "",
		sequenceNumber: "49595160041073623401520312716573683571199835999744032770"	//unmanaged
	}
};

const baseEventStruct = {
	Records: []
};

class KinesisEventGenerator {

}
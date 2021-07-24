import firebase from "firebase/app";
import { 
    Activity, 
    Category, 
    Record, 
    RecordSchema,
    PartialActivity, 
    PartialCategory, 
    PartialRecord, 
    ValueType
} from "./client-schema";

/**
 * Everything on the server is sent as a string. This serialisation file
 * provides method to cast between the correct typings.
 * 
 *  
 */

export function serialise(record: Record, recordSchema: RecordSchema) {

    let output = {};
    for (let [label, attributeSchema] of Object.entries(recordSchema.key)) {


    }

}

class DataType {
    static deserialise: (value: any) => any;
    static serialise: (value: any) => any;
}

class TimeStamp {

    public static serialise = (value: string) => {
        return value;
    };

    public static deserialise = (value: firebase.firestore.Timestamp) => {
        return {
            value: value.toDate().toISOString()
        } as TimeStamp
    };
}

class Duration {

    public static serialise = (value: {
        timeStart: TimeStamp,
        timeEnd: TimeStamp,
    }) => {
        return value;
    };

    public static deserialise = (value: { 
        timeStart: firebase.firestore.Timestamp, 
        timeEnd: firebase.firestore.Timestamp
    }) => {
        return {
            timeStart: TimeStamp.deserialise(value.timeStart),
            timeEnd: TimeStamp.deserialise(value.timeEnd),
        } as Duration
    };
}
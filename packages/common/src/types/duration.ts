import { MetaType, DataType } from ".";
import { TimestampFormat, TimestampMeta } from "./timestamp";
import firebase from "firebase/app";

export interface Duration {
    start: string;
    end: string;
}

export class DurationMeta implements MetaType {
    
    name: DataType = 'Duration';
    props: { format: TimestampFormat } = { format: TimestampFormat.ISO };

    static getHoursMinuteDifference(value: Duration): HourMinuteDuration {
        const t1 = new Date(value.start);
        const t2 = new Date(value.end);
        const diffMs = (+t2 - +t1);
        let hours = Math.floor((diffMs % 86400000) / 3600000);
        let minutes = Math.round(((diffMs % 86400000) % 3600000) / 60000) % 60;
        return [hours, minutes];
    }

    /** Serialise to be sent to the database */
    static serialise(value: Duration, props: any): Duration {
        return {
            start: TimestampMeta.serialise(value.start, props),
            end: TimestampMeta.serialise(value.end, props)
        };
    }

    /** Deserialise value recieved from server */
    static deserialise(value: {
        start: firebase.firestore.Timestamp,
        end: firebase.firestore.Timestamp
    }, props: any) : Duration {
        return {
            start: TimestampMeta.deserialise(value.start, props),
            end: TimestampMeta.deserialise(value.end, props)
        };
    };
}

type HourMinuteDuration = [hours: number, minutes: number];
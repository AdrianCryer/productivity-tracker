import { MetaType, DataType } from ".";
import firebase from "firebase/app";

export enum TimestampFormat {
    LOCAL,
    ISO
}

export class TimestampMeta implements MetaType {
    
    name: DataType = 'Date';
    props: { format: TimestampFormat } = { format: TimestampFormat.ISO };

    static fromDate(date: Date, props: any): string {
        return date.toISOString();
    }

    /** Serialise to be sent to the database */
    static serialise(value: string, props: any): string {
        return (new Date(value)).toISOString();
    }

    /** Deserialise value recieved from server */
    static deserialise(value: firebase.firestore.Timestamp, props: any) {
        return this.fromDate(value.toDate(), props);
    };
}
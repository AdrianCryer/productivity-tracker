import { MetaType, DataType } from ".";
import firebase from "firebase/app";

enum DateFormat {
    LOCAL,
    // US,
    // INTERNATIONAL,
    ISO
};

export class DateMeta implements MetaType {
    
    name: DataType = 'Date';
    props: { format: DateFormat; } = { format: DateFormat.ISO };

    constructor(format?: DateFormat) {
        if (format)
            this.props.format = format;
    }

    static fromDate(date: Date, props: any): string {
        if (props.format === DateFormat.LOCAL)
            return date.toLocaleDateString();
        if (props.format === DateFormat.ISO)
            return date.toISOString();
        return date.toString();
    }

    /** Serialise to be sent to the database */
    static serialise(value: string, props: any): string {
        return (new Date(value)).toISOString();
    }

    /** Deserialise value recieved from server */
    static deserialise(value: firebase.firestore.Timestamp, props: any): string {
        return this.fromDate(value.toDate(), props);
    };
}
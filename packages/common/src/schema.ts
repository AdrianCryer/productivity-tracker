import firebase from "firebase/app";

export type User = {
    id: string;
    displayName: string | null,
    email: string | null;
};

export interface Category {
    id: string;
    name: string;
    dateAdded: string;
    activities: { [id: string]: Activity };
    colour: string;
};

export interface Activity {
    id: string;
    name: string;
    dateAdded: string;
    schema: RecordSchema;
};

export interface DataRecord {
    id: string;
    categoryId: string;
    activityId: string;
    timeCreated: string;
    data: TimedData;
};

export type Column = Duration | TimedString | TimedNumber;
export type ColumnDescription = 'Duration' | 'TimedString' | 'TimedNumber';
export type RecordType = TimedData[];
export type RecordSchema = {
    type: ColumnDescription,
    attributes?: any
};

export type Indexed<T> = { [id: string]: T };

export type PartialCategory = Partial<Omit<Category, 'activities'>> & Pick<Category, 'id'>;
export type PartialActivity = Partial<Activity> & Pick<Activity, 'id'>;
export type PartialDataRecord = Partial<DataRecord> & Pick<DataRecord, 'id'>;

export type OnBatchCategoryChange = (
    updates: {
        category: Omit<Category, 'activities'>, 
        action: firebase.firestore.DocumentChangeType
    }[]
) => void;

export type OnBatchActivitiesChange = (
    updates: {
        categoryId: string, 
        activity: Activity, 
        action: firebase.firestore.DocumentChangeType
    }[]
) => void;

// export function validateRecordType(schema: ColumnDescription[], record: RecordType[]): boolean {
//     if (schema.length !== record.length) {
//         return false;
//     }
//     for (let i = 0; i < schema.length; i++) {
//         if (typeof record[i] !== schema[i])
//             return false;
//     }
//     return true;
// }

/**
 * Primitive Data Types
 */
export interface TimedData {
    getRelevantTimes(): string[];
};

export class Duration implements TimedData {
    timeStart: string;
    timeEnd: string;

    constructor(timeStart: string, timeEnd: string) {
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
    }

    getRelevantTimes(): string[] {
        return [this.timeStart, this.timeEnd];
    }
};

export class TimedString implements TimedData {
    time: string;
    value: string;

    constructor(time: string, value: string) {
        this.time = time;
        this.value = value;
    }

    getRelevantTimes(): string[] {
        return [this.time];
    }
};

export class TimedNumber implements TimedData {
    time: string;
    value: number;
    type: 'integer' | 'decimal';
    precision?: number;

    constructor(time: string, value: number, type: 'integer' | 'decimal', precision?: number) {
        this.time = time;
        this.value = value;
        this.type = type;
        this.precision = precision;
    }

    getRelevantTimes(): string[] {
        return [this.time];
    }
};

export type PrimitiveTypes = Duration | string | number;

export class TimedCollection implements TimedData {
    time: string;
    collection: PrimitiveTypes[];
    labels: string[];

    constructor(time: string, collection: PrimitiveTypes[], labels: string[]) {
        this.time = time;
        this.collection = collection;
        this.labels = labels;
    }

    getRelevantTimes(): string[] {
        return [this.time];
    }
}
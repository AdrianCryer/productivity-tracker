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
    colour: string;
};

export interface Activity {
    id: string;
    categoryId: string;
    name: string;
    dateAdded: string;
    schema: ActivitySchema;
};

export interface DataRecord {
    id: string;
    activityId: string;
    timeCreated: string;
    data: DataRecordData;
};

export type DataRecordData = Duration | TimedString | TimedNumber;
export type DataRecordDescription = 'Duration' | 'TimedString' | 'TimedNumber';

export type ActivitySchema = {
    type: DataRecordDescription,
    attributes?: any
};

export type Indexed<T> = { [id: string]: T };

export type PartialCategory = Partial<Category> & Pick<Category, 'id'>;
export type PartialActivity = Partial<Activity> & Pick<Activity, 'id'>;
export type PartialDataRecord = Partial<DataRecord> & Pick<DataRecord, 'id'>;

export type OnBatchCategoryChange = (
    updates: {
        category: Category, 
        action: firebase.firestore.DocumentChangeType
    }[]
) => void;

export type OnBatchActivitiesChange = (
    updates: {
        activity: Activity, 
        action: firebase.firestore.DocumentChangeType
    }[]
) => void;

export type OnBatchRecordsChange = (
    updates: {
        record: Omit<DataRecord, 'data'> & { data: any }, 
        action: firebase.firestore.DocumentChangeType
    }[]
) => void;

export function getRelevantTimes(data: any, schema: ActivitySchema): string[] {
    if (schema.type === 'Duration') {
        const duration = data as Duration;
        console.log(duration)
        return [duration.timeStart, duration.timeEnd];
    } else if (schema.type === 'TimedNumber') {
        const duration = data as TimedNumber;
        return [duration.time];
    } else if (schema.type === 'TimedString') {
        const duration = data as TimedString;
        return [duration.time];
    }
    return [];
}


/**
 * Primitive Data Types
 */
export type PrimitiveTypes = Duration | string | number;


export interface Duration {
    timeStart: string;
    timeEnd: string;
};

export interface TimedString {
    time: string;
    value: string;
};

export interface TimedNumber {
    time: string;
    value: number;
    type: 'integer' | 'decimal';
    precision?: number;
};

export interface TimedCollection {
    time: string;
    collection: PrimitiveTypes[];
    labels: string[];
}

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
    schema: ColumnDescription[];
};

export interface DataRecord {
    id: string;
    categoryId: string;
    activityId: string;
    timeCreated: string;
    record: RecordType[]
};

export type Column = Duration | string | number;
export type ColumnDescription = 'Duration' | 'string' | 'number';
export type RecordType = Column[];

export type Indexed<T> = { [id: string]: T };

export type PartialCategory = Partial<Category> & Pick<Category, 'id'>;
export type PartialActivity = Partial<Omit<Activity, 'id'>>;
export type PartialDataRecord = Partial<Omit<DataRecord, 'id'>>;

export function validateRecordType(schema: ColumnDescription[], record: RecordType[]): boolean {
    if (schema.length !== record.length) {
        return false;
    }
    for (let i = 0; i < schema.length; i++) {
        if (typeof record[i] !== schema[i])
            return false;
    }
    return true;
}
/**
 * Primitive Data Types
 */
export interface Duration {
    timeStart: string;
    timeEnd: string;
};
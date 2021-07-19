
/** Core data types */
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

export interface Record {
    id: string;
    activityId: string;
    timeCreated: string;
    data: any;
};

export interface Activity {
    id: string;
    categoryId: string;
    name: string;
    dateAdded: string;
    schema: RecordSchema;
    records: Record[];
};

/** Partials */
export type PartialCategory = Partial<Category> & Pick<Category, 'id'>;
export type PartialActivity = Partial<Activity> & Pick<Activity, 'id'>;
export type PartialRecord = Partial<Record> & Pick<Record, 'id'>;

/** Helper data types */
export interface RecordSchema {
    key: { 
        [label: string]: { 
            type: KeyType, 
            props?: any 
        } 
    },
    value?: { 
        [label: string]: { 
            type: ValueType, 
            props?: any 
        } 
    },
    derived?: {
        [label: string]: {
            function: Modifier,
            params: string[]
        }
    },
    indexes?: { [name: string]: { function: Modifier} },
    order?: string[],
    props?: {
        displayInAdder?: boolean,
    }
};

/** Allowed key types */
export type KeyType = 'Timestamp' | 'Day' | 'Week' | 'Year';

/** Allowed value types */
export type ValueType = 'Number' | 'String';

/** Modifiers that can be applied to fields */
export type Modifier = 'getFormmattedDuration' | 'sum' | 'average';

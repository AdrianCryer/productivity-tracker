import { MetaType } from "./types";

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
    groupings: GroupBySchema[]
};

/** Partials */
export type PartialCategory = Partial<Category> & Pick<Category, 'id'>;
export type PartialActivity = Partial<Omit<Activity, 'records'>> & Pick<Activity, 'id'>;
export type PartialRecord = Partial<Record> & Pick<Record, 'id'>;

/** Helper data types */
interface Dictionary<T> {
    [key: string]: T;
}

export interface RecordSchema {
    key: Dictionary<MetaType>,
    value?: Dictionary<MetaType>,
    derived?: Dictionary<string | AttributeModifier>
    order?: string[],
    props?: {
        displayInAdder?: boolean,
    }
};

/** 
 * Dictates how records can be grouped by for display.
 * Default grouping is to display all records.
 */
export type GroupBySchema = (string | AttributeModifier)[];

export interface AttributeModifier {
    function: 'Tuple' | 'ToDateString' | 'ToWeekString' | 'ToYearString' | 'getFormmattedDuration',
    params: GroupBySchema
}

let example: GroupBySchema = [
    { function: 'ToDateString', params: ['TimeStart'] },
    { function: 'ToDateString', params: ['TimeEnd'] }
];
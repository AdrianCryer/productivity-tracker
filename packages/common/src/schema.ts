
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
    schema: ActivitySchema;
    // records: 
};
/** Make this a single level schema by default */
export type ActivitySchema = Duration;

export interface Record {
    timeCreated: string;
}

/**
 * Types
 */
export interface Duration {
    timeStart: string;
    timeEnd: string;
}
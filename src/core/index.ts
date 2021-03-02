/**
 * Atomic structures
 */
export interface Activity {
    id: number;
    name: string;
    dateAdded: string;
};

export interface Category {
    id: number;
    name: string;
    dateAdded: string;
    activities: { [id: string]: Activity };
};

export interface DurationEvent {
    id: number;
    activityId: number;
    categoryId: number;
    duration: Duration;
};

export interface Duration {
    timeStart: string;
    timeEnd: string;
}

/**
 * Derived / Index structures
 */
export type CategoryDurations = { [categoryId: number]: Duration[] };


export interface EventCollection {
    [categoryId: string]: {
        [activityId: string]: Duration[]
    }
};
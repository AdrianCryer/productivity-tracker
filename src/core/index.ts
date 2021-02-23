
export interface Activity {
    name: string;
    dateAdded: Date;
};

export interface Category {
    name: string;
    dateAdded: Date;
    activities: Activity[];
};

export interface Duration {
    timeStart: Date;
    timeEnd: Date;
};

export interface EventCollection {
    [categoryId: string]: {
        [activityId: string]: Duration[]
    }
};

export interface InputOutputHandler {
    serialize(): void;
};
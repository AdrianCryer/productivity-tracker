import ElectronStore from 'electron-store';
import { Draft } from 'immer';
import { State } from 'zustand';
import { createStore } from "./Store";
import { Indexed,
    Category,
    Activity,
    DataRecord,
    OnBatchCategoryChange,
    OnBatchActivitiesChange, 
    OnBatchRecordsChange,
    ActivitySchema,
    getRelevantTimes,
    Duration
} from '@productivity-tracker/common/lib/schema';


export interface IRecordStore extends State {
    /** PERSISTED STATE */
    categories: Indexed<Category>;
    activities: Indexed<Activity>;
    records: Indexed<DataRecord>;

    /** DERIVED STATE */
    recordsByActivity: { [key: string]: { [id: string]: boolean } };
    recordsByDate: { [key: string]: { [id: string]: boolean } };

    _modifyCategoriesBatch: OnBatchCategoryChange;
    _modifyActivitiesBatch: OnBatchActivitiesChange;
    _modifyRecordsBatch: OnBatchRecordsChange;

    /** INDEXES */
    getRecordsByDate: (date: Date) => DataRecord[];
    getRecordsByDateString: (dateString: string) => DataRecord[];
    getRecordsByActivity: (categoryId: string, activityId: string) => DataRecord[];
    getActivities: (categoryId: string) => Activity[];
    getActivitiesIndexed: (categoryId: string) => Indexed<Activity>;
};

export const activitiesSelector = (state: IRecordStore) => state.activities;
export const categoriesSelector = (state: IRecordStore) => state.categories;

const storageKey = "productivity-tracker-storage";
const storage = new ElectronStore<IRecordStore>();

const persistOptions = {
    name: storageKey,
    getStorage: () => ({
        getItem: (name: string) => {
            const res = storage.get(name);
            return typeof res === 'string' ? res : null;
        },
        setItem: (name: string, value: string) => { storage.set(name, value) }
    }),
};

/**
 * Store configurations
 */
const useRecordStore = createStore<IRecordStore>((set, get) => ({
    categories: {},
    activities: {},
    records: {},
    recordsByActivity: {},
    recordsByDate: {},

    _modifyCategoriesBatch(updates) {
        set(state => {
            for (let { category, action } of updates) {

                if (action === 'added') {
                    state.categories[category.id] = category;
                } else if (action === 'modified') {
                    state.categories[category.id] = {
                        ...state.categories[category.id],
                        ...category,
                    };
                } else {
                    if (!(category.id in state.categories)) 
                        continue;
                    // Remove all records within category
                    for (let record of Object.values(state.records)) {
                        const activity = get().activities[record.activityId];
                        if (activity.categoryId === category.id) {
                            handleDeleteRecord(state, record, activity.schema);
                        }
                    }
                    delete state.categories[category.id];
                }
            }
        });
    },

    _modifyActivitiesBatch(updates) {
        set(state => {
            for (let { activity, action } of updates) {
                if (action === 'added' || action === 'modified') {
                    // Should check schema 
                    state.activities[activity.id] = activity;

                } else if (action === 'removed') {
                    if (!(activity.id in state.activities)) 
                        continue;

                    for (let record of Object.values(state.records)) {
                        if (record.activityId === activity.id) {
                            const activity = get().activities[record.activityId];
                            handleDeleteRecord(state, record, activity.schema);
                        }
                    }
                    delete state.activities[activity.id];
                }
            }
        });
    },    

    _modifyRecordsBatch(updates) {
        set(state => {
            for (let { record, action } of updates) {

                // Skip record since if it does not belong to a category
                if (!(record.activityId in state.activities))
                    continue;

                const schema = state.activities[record.activityId].schema;
                const parsedRecord = parseRecordFromFirebase(record, schema);

                if (action === 'added') {
                    handleCreateRecord(state, parsedRecord, schema);
                } else if (action === 'modified') { 
                    state.records[record.id] = parsedRecord;
                } else if (action === 'removed') {
                    if (!(record.id in state.records)) 
                        continue;
                    handleDeleteRecord(state, parsedRecord, schema);
                }
            }
        });
    },

    // INDEXES
    getRecordsByDate(date: Date) {
        const dateString = date.toLocaleDateString();
        if (!(dateString in get().recordsByDate)) {
            return [];
        }
        return Object.keys(get().recordsByDate[dateString])
                    .map((id: string) => get().records[id]);
    },

    getRecordsByDateString(dateString: string) {
        if (!(dateString in get().recordsByDate)) {
            return [];
        }
        return Object.keys(get().recordsByDate[dateString])
                    .map((id: string) => get().records[id]);
    },

    getRecordsByActivity(activityId: string) {
        if (!(activityId in get().recordsByActivity)) {
            return [];
        }
        return Object.keys(get().recordsByActivity[activityId])
                    .map((id: string) => get().records[id]);
    },

    getActivities(categoryId: string) {
        return Object.values(get().activities).filter(a => a.categoryId === categoryId);
    },

    getActivitiesIndexed(categoryId) {
        return this.getActivities(categoryId)
                   .reduce((res: Indexed<Activity>, act: Activity) =>  (res[act.id] = act, res), {})
    }

}), persistOptions);

function handleDeleteRecord(state: Draft<IRecordStore>, record: DataRecord, schema: ActivitySchema) {
    
    const key = record.activityId;
    if (key in state.recordsByActivity && record.id in state.recordsByActivity[key]) {
        delete state.recordsByActivity[key][record.id];
    }

    const keys = getRelevantTimes(record.data, schema).map(dateString => 
        (new Date(dateString)).toLocaleDateString()
    );
    for (let k of keys) {
        if (k in state.recordsByDate && record.id in state.recordsByDate[k]) {
            delete state.recordsByDate[k][record.id];
        }
    }

    delete state.records[record.id];
}

function handleCreateRecord(state: Draft<IRecordStore>, record: DataRecord, schema: ActivitySchema) {

    state.records[record.id] = record;

    if (!state.recordsByActivity[record.activityId]) {
        state.recordsByActivity[record.activityId] = {};
    }
    state.recordsByActivity[record.activityId][record.id] = true;

    let keys = getRelevantTimes(record.data, schema).map(dateString => 
        (new Date(dateString)).toLocaleDateString()
    )
    keys = keys.filter((data, i) => keys.indexOf(data) === i);

    for (let k of keys) {
        if (!state.recordsByDate[k]) {
            state.recordsByDate[k] = {};
        }
        state.recordsByDate[k][record.id] = true;
    }
}

function serialiseDate(date: Date) {
    return date.toISOString();
}

function parseRecordFromFirebase(
    record: Omit<DataRecord, 'data'> & { data: any }, 
    schema: ActivitySchema
): DataRecord {
    let data: any;
    if (schema.type === 'Duration') {
        data = {
            timeStart: serialiseDate(record.data.timeStart.toDate()), 
            timeEnd: serialiseDate(record.data.timeEnd.toDate())
        } as Duration;
    } else if (schema.type === 'TimedNumber' || schema.type === 'TimedString') {
        data = {
            ...record.data,
            time: serialiseDate(record.data.time.toDate()),
        };
    } else {
        data = record.data;
    }
    return { 
        ...record, 
        // timeCreated: serialiseDate(record.timeCreated.toDate()),
        data 
    };
}

export { useRecordStore };
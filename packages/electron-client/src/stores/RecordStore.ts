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
    recordsByActivity: { [key: string]: string[] };
    recordsByDate: { [key: string]: string[] };

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
    // getStorage: () => ({
    //     getItem: (name: string) => {
    //         const res = storage.get(name);
    //         return typeof res === 'string' ? res : null;
    //     },
    //     setItem: (name: string, value: string) => { storage.set(name, value) }
    // }),
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
        console.log(updates);
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

                if (action === 'added') {
                    const parsedRecord = parseRecordFromFirebase(record, schema);
                    console.log("adding", record)
                    handleCreateRecord(state, parsedRecord, schema);
                } else if (action === 'modified') { 
                    state.records[record.id] = parseRecordFromFirebase(record, schema);
                } else if (action === 'removed') {
                    console.log('deleting', record)
                    if (!(record.id in state.records)) 
                        continue;
                    delete state.records[record.id];
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
        return get().recordsByDate[dateString]
                    .map((id: string) => get().records[id]);
    },

    getRecordsByDateString(dateString: string) {
        if (!(dateString in get().recordsByDate)) {
            return [];
        }
        return get().recordsByDate[dateString]
                    .map((id: string) => get().records[id]);
    },

    getRecordsByActivity(activityId: string) {
        if (!(activityId in get().recordsByActivity)) {
            return [];
        }
        return get().recordsByActivity[activityId]
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
    
    let key = record.activityId;
    let index = state.recordsByActivity[key].findIndex(rid => rid === record.id);
    state.recordsByActivity[key].splice(index, 1);

    const keys = getRelevantTimes(record.data, schema).map(dateString => 
        (new Date(dateString)).toLocaleDateString()
    );
    for (let k of keys) {
        index = state.recordsByDate[k].findIndex(r => r === record.id);
        state.recordsByDate[k].splice(index, 1);
    }

    delete state.records[record.id];
}

function handleCreateRecord(state: Draft<IRecordStore>, record: DataRecord, schema: ActivitySchema) {
    // console.log(Object.keys(state.recordsByDate).map(ds => [ds, state.recordsByDate[ds].toString()]))

    state.records[record.id] = record;

    if (!state.recordsByActivity[record.activityId]) {
        state.recordsByActivity[record.activityId] = [];
    }
    if (!state.recordsByActivity[record.activityId].includes(record.id))
        state.recordsByActivity[record.activityId].push(record.id);

    let keys = getRelevantTimes(record.data, schema).map(dateString => 
        (new Date(dateString)).toLocaleDateString()
    )
    keys = keys.filter((data, i) => keys.indexOf(data) === i);

    for (let k of keys) {
        if (!state.recordsByDate[k]) {
            state.recordsByDate[k] = [];
        }
        if (!state.recordsByDate[k].includes(record.id))
            state.recordsByDate[k].push(record.id);
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
import ElectronStore from 'electron-store';
import { Draft } from 'immer';
import { State } from 'zustand';
import { createStore } from "./Store";
import { Indexed,
    Category,
    DataRecord,
    OnBatchCategoryChange,
    OnBatchActivitiesChange 
} from '@productivity-tracker/common/lib/schema';


export interface IRecordStore extends State {
    /** PERSISTED STATE */
    categories: Indexed<Category>;
    records: Indexed<DataRecord>;

    /** DERIVED STATE */
    recordsByActivity: { [key: string]: string[] };
    recordsByDate: { [key: string]: string[] };

    _modifyCategoriesBatch: OnBatchCategoryChange;
    _modifyActivitiesBatch: OnBatchActivitiesChange;

    /** INDEXES */
    getRecordsByDate: (date: Date) => DataRecord[];
    getRecordsByDateString: (dateString: string) => DataRecord[];
    getRecordsByActivity: (categoryId: string, activityId: string) => DataRecord[];
};

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
    records: {},
    recordsByActivity: {},
    recordsByDate: {},

    _modifyCategoriesBatch(updates) {
        set(state => {
            for (let { category, action } of updates) {

                if (action === 'added') {
                    let activities = {};
                    if (category.id in state.categories) {
                        activities = state.categories[category.id].activities;
                    }
                    state.categories[category.id] = {
                        ...category,
                        activities
                    };
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
                        if (record.categoryId === category.id) {
                            handleDeleteRecord(state, record);
                        }
                    }
                    delete state.categories[category.id];
                }
            }
        });
    },

    _modifyActivitiesBatch(updates) {
        set(state => {
            for (let { categoryId, activity, action } of updates) {
                
                /**
                 * What happens if a category and activity is created at the
                 * same time? Race condition which may break internal state.
                 * 
                 * @todo
                 */
                let category = state.categories[categoryId];

                if (action === 'added' || action === 'modified') {
                    // Should check schema 
                    category.activities[activity.id] = activity;
                } else if (action === 'removed') {
                    if (!(activity.id in category.activities)) 
                        continue;

                    for (let record of Object.values(state.records)) {
                        if (record.categoryId === categoryId && record.activityId === activity.id) {
                            handleDeleteRecord(state, record);
                        }
                    }
                    delete state.categories[categoryId].activities[activity.id];
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

    getRecordsByActivity(categoryId: string, activityId: string) {
        const key = `${categoryId},${activityId}`;
        if (!(key in get().recordsByActivity)) {
            return [];
        }
        return get().recordsByActivity[key]
                    .map((id: string) => get().records[id]);
    }

}), persistOptions);

function handleDeleteRecord(state: Draft<IRecordStore>, record: DataRecord) {
    
    let key = `${record.categoryId},${record.activityId}`;
    let index = state.recordsByActivity[key].findIndex(rid => rid === record.id);
    state.recordsByActivity[key].splice(index, 1);

    const keys = record.data.getRelevantTimes().map(dateString => 
        (new Date(dateString)).toLocaleDateString()
    );
    for (let k of keys) {
        index = state.recordsByDate[k].findIndex(r => r === record.id);
        state.recordsByDate[key].splice(index, 1);
    }

    delete state.records[record.id];
}

export { useRecordStore };
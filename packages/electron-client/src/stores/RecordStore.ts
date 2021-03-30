import ElectronStore from 'electron-store';
import { Draft } from 'immer';
import { State } from 'zustand';
import { createStore } from "./Store";
import { Indexed,
    Category,
    Activity,
    DataRecord,
    OnBatchCategoryChange,
    OnBatchActivitiesChange 
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
        console.log("Updated activities");
        set(state => {
            for (let { activity, action } of updates) {
                if (action === 'added' || action === 'modified') {
                    // Should check schema 
                    state.activities[activity.id] = activity;

                } else if (action === 'removed') {
                    if (!(activity.id in state.activities)) 
                        continue;

                    for (let record of Object.values(state.records)) {
                        if (record.categoryId === activity.categoryId && 
                            record.activityId === activity.id) {
                            handleDeleteRecord(state, record);
                        }
                    }
                    delete state.activities[activity.id];
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
    },

    getActivities(categoryId: string) {
        console.log(get().activities);
        return Object.values(get().activities).filter(a => a.categoryId === categoryId);
    },

    getActivitiesIndexed(categoryId) {
        return this.getActivities(categoryId)
                   .reduce((res: Indexed<Activity>, act: Activity) =>  (res[act.id] = act, res), {})
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
import ElectronStore from 'electron-store';
import { State } from 'zustand';
import { Activity, Category, Duration, DurationEvent } from '../core';
import { createStore } from "./Store";

/**
 * Primary data store of the application.
 */
type Indexed<T> = { [id: number]: T }
type PartialCategory = Partial<Omit<Category, 'id'>>
type PartialActivity = Partial<Omit<Activity, 'id'>>

export interface IDataStore extends State {

    /** PERSISTED STATE */
    categories: Indexed<Category>;
    events: Indexed<DurationEvent>;

    /** DERIVED STATE */
    eventsByActivity: { [key: string]: number[] };
    eventsByDate: { [key: string]: number[] };

    /** INDEXES */
    getEventsByDate: (date: Date) => DurationEvent[];
    getEventsByDateString: (dateString: string) => DurationEvent[];
    getEventsByActivity: (categoryId: number, activityId: number) => DurationEvent[];
    
    /** ACTIONS */
    addEvent: (categoryId: number, activityId: number, duration: Duration) => void;
    removeEvent: (eventId: number) => void;
    updateEvent: (partial: Pick<DurationEvent, 'id'> & Partial<DurationEvent>) => void;

    addActivity: (categoryId: number, activity: Activity) => void;
    editActivity: (categoryId: number, activityId: number, partial: PartialActivity) => void;
    deleteActivity: (categoryId: number, activity: Activity) => void;
    deleteAndMergeActivity: (categoryId: number, activity: Activity, mergeToActivityId: number) => void;

    addCategory: (category: Category) => void;
    editCategory: (category: Category, props: PartialCategory) => void;
    deleteCategory: (category: Category) => void;
};


/**
 * Local storage
 */
const storageKey = "productivity-tracker-storage";
const storage = new ElectronStore<IDataStore>();

const derivedFields = ['eventsByActivity', 'eventsByDate'];
const persistOptions = {
    name: storageKey,
    getStorage: () => ({
        getItem: (name: string) => {
            const res = storage.get(name);
            return typeof res === 'string' ? res : null;
        },
        setItem: (name: string, value: string) => { storage.set(name, value) }
    }),
    /** Just store the derived fields. Makes things easier for now. */
    // blacklist: derivedFields
};

/**
 * Store configurations
 */
const useDataStore = createStore<IDataStore>((set, get) => ({
    categories: {
        // Test data
        0: {
            id: 0,
            name: "Projects",
            dateAdded: (new Date("2021-02-27")).toISOString(),
            activities: {
                0: {
                    id: 0,
                    name: "Voxel Game",
                    dateAdded: (new Date("2021-02-27")).toISOString()
                }
            }
        }
    },
    events: {},
    eventsByActivity: {},
    eventsByDate: {},

    addEvent(categoryId: number, activityId: number, duration: Duration) {
        set(state => {
            // Just get latest for now.
            const id = Object.keys(state.events).length;
            const event: DurationEvent = { id, categoryId, activityId, duration };
            state.events[id] = event;

            // Handle indexes
            const key = new String([categoryId, activityId]) as string;
            if (!state.eventsByActivity[key]) {
                state.eventsByActivity[key] = [];
            }
            state.eventsByActivity[key].push(id);

            // By Date
            const dateString = (new Date(duration.timeStart)).toLocaleDateString();
            if (!state.eventsByDate[dateString]) {
                state.eventsByDate[dateString] = [];
            }
            state.eventsByDate[dateString].push(id);
        });
    },

    removeEvent(eventId: number) {
        set(state => {
            if (!state.events[eventId]) {
                return;
            }
            const event = state.events[eventId];
            
            // Need to search in indexes...
            let key = new String([event.categoryId, event.activityId]) as string;
            let index = state.eventsByActivity[key].findIndex(e => index === eventId);
            state.eventsByActivity[key].splice(index, 1);
            
            key = (new Date(event.duration.timeStart)).toLocaleDateString();
            index = state.eventsByDate[key].findIndex(e => index === eventId);
            state.eventsByDate[key].splice(index, 1);

            delete state.events[eventId];
        });
    },

    updateEvent(partial: Pick<DurationEvent, 'id'> & Partial<DurationEvent>) {
        set(state => { 
            const event: DurationEvent = { ...state.events[partial.id], ...partial };
            state.events[partial.id] = event; 

            // Need to update indexes
            // let key = new String([event.categoryId, event.activityId]) as string;
            // let index = state.eventsByActivity[key].findIndex(e => e.id === event.id);
            // state.eventsByActivity[key].splice(index, 1, event);

            // key = (new Date(event.duration.timeStart)).toLocaleDateString();
            // index = state.eventsByDate[key].findIndex(e => e.id === event.id);
            // state.eventsByDate[key].splice(index, 1, event);
        });
    },

    addActivity(categoryId: number, activity: Activity) {
        set(state => {
            state.categories[categoryId].activities[activity.id] = activity;
        });
    },

    editActivity(categoryId: number, activityId: number, partial: PartialActivity) {
        if (!(categoryId in get().categories)) {
            throw new Error("Cannot edit activity in an unknown activity " + categoryId);
        }
        let category = get().categories[categoryId]; 
        let activity = category.activities[activityId];

        if (Object.values(category.activities).find(a => a.name === partial.name)) {
            throw new Error(`Activity name '${activity.name}' already exists in category ${category.name}`);
        }
        set(state => {
            state.categories[category.id].activities[activityId] = {
                ...activity,
                ...partial
            };
        });
    },

    deleteActivity(categoryId: number, activity: Activity) {
        // Need to check events / merge to another activity.
        set(state => { delete state.categories[categoryId].activities[activity.id] });
    },

    deleteAndMergeActivity(categoryId: number, activity: Activity, mergeToActivityId: number) {

        console.log(categoryId, activity, mergeToActivityId)

        // Check activity exists
        if (!(categoryId in get().categories)) {
            throw new Error("Category does not exist");
        }

        if (!(mergeToActivityId in get().categories[categoryId].activities)) {
            throw new Error("Activity does not exist in category");
        }

        set(state => {

            const key = new String([categoryId, activity.id]) as string; 
            const newKey = new String([categoryId, mergeToActivityId]) as string;
            const events = state.eventsByActivity[key];

            state.eventsByActivity[newKey] = events;
            events.forEach(eventId => {
                state.events[eventId].activityId = mergeToActivityId;
            });

            delete state.eventsByActivity[key];
            delete state.categories[categoryId].activities[activity.id];
        });
    },

    addCategory(category: Category) {
        if (category.id in get().categories) {
            throw new Error("Category already exists");
        }
        if (Object.values(get().categories).find(c => c.name === category.name)) {
            throw new Error(`Category name '${category.name}' already exists`);
        }
        set(state => {
            state.categories[category.id] = category;
        });
    },

    editCategory(category: Category, partial: PartialCategory) {
        set(state => { state.categories[category.id] = { ...category, ...partial } });
    },

    deleteCategory(category: Category) {
        set(state => { delete state.categories[category.id] });
    },

    // INDEXES
    getEventsByDate(date: Date) {
        const dateString = date.toLocaleDateString();
        if (!(dateString in get().eventsByDate)) {
            return [];
        }
        return get().eventsByDate[dateString]
                    .map((id: number) => get().events[id]);
    },

    getEventsByDateString(dateString: string) {
        if (!(dateString in get().eventsByDate)) {
            return [];
        }
        return get().eventsByDate[dateString]
                    .map((id: number) => get().events[id]);
    },

    getEventsByActivity(categoryId: number, activityId: number) {
        const key = new String([categoryId, activityId]) as string;
        if (!(key in get().eventsByActivity)) {
            return [];
        }
        return get().eventsByActivity[key]
                    .map((id: number) => get().events[id]);
    }

}), persistOptions);

export { useDataStore };
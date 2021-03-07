import ElectronStore from 'electron-store';
import { State } from 'zustand';
import { Activity, Category, Duration, DurationEvent } from '../core';
import { createStore } from "./Store";

/**
 * Primary data store of the application.
 */
type Indexed<T> = { [id: number]: T }
type PartialCategory = Partial<Omit<Category, 'id'>>

export interface IDataStore extends State {

    /** PERSISTED STATE */
    categories: Indexed<Category>;
    events: Indexed<DurationEvent>;

    /** DERIVED STATE */
    eventsByActivity: { [key: string]: DurationEvent[] };
    eventsByDate: { [key: string]: DurationEvent[] };

    /** ACTIONS */
    addEvent: (categoryId: number, activityId: number, duration: Duration) => void;
    removeEvent: (eventId: number) => void;
    updateEvent: (partial: Pick<DurationEvent, 'id'> & Partial<DurationEvent>) => void;
    addActivity: (categoryId: number, activity: Activity) => void;
    addCategory: (category: Category) => void;
    editCategory: (category: Category, props: PartialCategory) => void;
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
            state.eventsByActivity[key].push(event);

            // By Date
            const dateString = (new Date(duration.timeStart)).toLocaleDateString();
            if (!state.eventsByDate[dateString]) {
                state.eventsByDate[dateString] = [];
            }
            state.eventsByDate[dateString].push(event);
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
            let index = state.eventsByActivity[key].findIndex(e => e.id === eventId);
            state.eventsByActivity[key].splice(index, 1);
            
            key = (new Date(event.duration.timeStart)).toLocaleDateString();
            index = state.eventsByDate[key].findIndex(e => e.id === eventId);
            state.eventsByDate[key].splice(index, 1);

            delete state.events[eventId];
        });
    },

    updateEvent(partial: Pick<DurationEvent, 'id'> & Partial<DurationEvent>) {
        set(state => { 
            const event: DurationEvent = { ...state.events[partial.id], ...partial };
            state.events[partial.id] = event; 

            // Need to update indexes
            let key = new String([event.categoryId, event.activityId]) as string;
            let index = state.eventsByActivity[key].findIndex(e => e.id === event.id);
            state.eventsByActivity[key].splice(index, 1, event);

            key = (new Date(event.duration.timeStart)).toLocaleDateString();
            index = state.eventsByDate[key].findIndex(e => e.id === event.id);
            state.eventsByDate[key].splice(index, 1, event);
        });
    },

    addActivity(categoryId: number, activity: Activity) {
        set(state => {
            state.categories[categoryId].activities[activity.id] = activity;
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
    }


}), persistOptions);

export { useDataStore };
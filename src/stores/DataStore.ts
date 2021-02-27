import ElectronStore from 'electron-store';
import { State } from 'zustand';
import { Category, Duration, DurationEvent } from '../core';
import { createStore } from "./Store";

/**
 * Primary data store of the application.
 */
type Indexed<T> = { [id: number]: T }
export interface IDataStore extends State {

    /** PERSISTED STATE */
    categories: Indexed<Category>;
    events: Indexed<DurationEvent>;

    /** DERIVED STATE */
    eventsByActivity: { [key: string]: Duration[] };
    eventsByDate: { [key: string]: DurationEvent[] };

    /** ACTIONS */
    addEvent: (categoryId: number, activityId: number, duration: Duration) => void;
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
        // 0: {
        //     id: 0,
        //     name: "Projects",
        //     dateAdded: (new Date("2021-02-27")).toString(),
        //     activities: [
        //         {
        //             id: 0,
        //             name: "Voxel Game",
        //             dateAdded: (new Date("2021-02-27")).toString()
        //         }
        //     ]
        // }
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
            state.eventsByActivity[key].push(duration);

            // By Date
            const dateString = (new Date()).toLocaleDateString();
            if (!state.eventsByDate[dateString]) {
                state.eventsByDate[dateString] = [];
            }
            state.eventsByDate[dateString].push(event);
        });
    },

    removeEvent(eventId: number) {

    }

}), persistOptions);

export { useDataStore };
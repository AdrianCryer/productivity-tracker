import ElectronStore from 'electron-store';
import create, { State, StateCreator } from 'zustand';
import { persist } from "zustand/middleware";
import { Category, Duration, EventCollection } from '../core';

export interface IDataStore extends State {
    indexedCategories: { [name: string]: Category };
    events: EventCollection;
    addEvent: (categoryName: string, activityName: string, duration: Duration) => void;
};

const store: StateCreator<IDataStore> = (set, get) => ({
    indexedCategories: {},
    events: {},
    addEvent: (categoryName: string, activityName: string, duration: Duration) => {
        console.log(get().events)
        set(state => ({
            events: { ...state.events, [categoryName]: {
                ...state.events[categoryName],
                [activityName]: [
                    ...state.events[categoryName][activityName],
                    duration
                ]
            }}
        }));
    }
});



const storageKey = "productivity-tracker-storage";
const storage = new ElectronStore<IDataStore>();
// const storeMiddleware: typeof devtools = config => (set, get, api) => 
//     // Set
//     config(args => {
//         storage.set(storageKey, args);
//         set(args);
//     }, 
//     // Get
//     get, 
//     api
// );

/**
 * From Zustand:
 * 
 * type StateStorage = {
 *     getItem: (name: string) => string | null | Promise<string | null>
 *     setItem: (name: string, value: string) => void | Promise<void>
 * }
 */
export const useDataStore = create<IDataStore>(persist(store, {
    name: storageKey,
    getStorage: () => ({
        getItem: (name: string) => {
            const res = storage.get(name);
            return typeof res === 'string' ? res : null;
        },
        setItem: (name: string, value: string) => { storage.set(name, value) }
    })
}));
import create, { State, StateCreator } from 'zustand';
import { persist } from "zustand/middleware";
import { Category, Duration, EventCollection } from '../core';
import fileStorage from 'electron-json-storage';

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

/**
 * From Zustand:
 * 
 * type StateStorage = {
 *     getItem: (name: string) => string | null | Promise<string | null>
 *     setItem: (name: string, value: string) => void | Promise<void>
 * }
 */
// const electronStorage: Storage = {
//     getItem: (key: string) => {
//         fileStorage.get(key, (error, data) => {
//             if (error) {
//                 console.error("Could not retrieve storage " + key);
//             }

//         });
//     }
// }

export const useDataStore = create<IDataStore>(persist(store, {
    name: "productivity-tracker-storage",
    // getStorage: () => sessionStorage
    // getStorage: () => ({
    //     getItem: (key: string) => fileStorage.getItem(key),
    //     setItem: (key: string, value: string) => { fileStorage.setItem(key, value) },
    // })
}));
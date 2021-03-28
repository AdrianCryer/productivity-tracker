import ElectronStore from 'electron-store';
import { Draft } from 'immer';
import { State } from 'zustand';
import firebase from "firebase/app";
import { createStore } from "./Store";
import { Indexed, Category, DataRecord, PartialCategory } from '@productivity-tracker/common/lib/schema';


export interface IRecordStore extends State {
    /** PERSISTED STATE */
    categories: Indexed<Category>;
    records: Indexed<DataRecord>;
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

    updateCategory(category: Omit<Category, 'activities'>, action: firebase.firestore.DocumentChangeType) {
        if (action === 'added') {
            set(state => {
                state.categories[category.id] = {
                    ...category,
                    activities: {}
                };
            });
        } else if (action === 'removed') {
            
        }
    },

    addCategory(category: Category) {
        set(state => {
            state.categories[category.id] = category;
        });
    },
    
}), persistOptions);
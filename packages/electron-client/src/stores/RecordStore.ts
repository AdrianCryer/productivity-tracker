import ElectronStore from 'electron-store';
import { Draft } from 'immer';
import { State } from 'zustand';
import { createStore } from "./Store";
import { Indexed, Category } from '@productivity-tracker/common/lib/schema';


export interface IRecordStore extends State {
    /** PERSISTED STATE */
    categories: Indexed<Category>;
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
    
}), persistOptions);
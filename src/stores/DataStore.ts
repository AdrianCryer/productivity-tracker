import ElectronStore from 'electron-store';
import create, { State, StateCreator } from 'zustand';
import { persist } from "zustand/middleware";
import { Category, Duration, EventCollection } from '../core';
import produce, { Draft } from "immer";

export interface IDataStore extends State {
    /** PERSISTED STATE */
    indexedCategories: { [name: string]: Category };
    events: EventCollection;

    /** DERIVED STATE */
    eventsByDate: { [date: string]: EventCollection };

    /** ACTIONS */
    addEvent: (categoryName: string, activityName: string, duration: Duration) => void;
    loadDerivedState: () => void;
};

type DraftSetState<T> = (fn: (draft: Draft<T>) => void) => void;
const immer = <T extends State>(
    config: StateCreator<T, DraftSetState<T>>
): StateCreator<T> => (set, get, api) => 
    config((fn) => set(produce(fn) as (state: T) => T), get, api);

const storageKey = "productivity-tracker-storage";
const storage = new ElectronStore<IDataStore>();

const derivedFields = ['eventsByDate'];
const persistOptions = {
    name: storageKey,
    getStorage: () => ({
        getItem: (name: string) => {
            const res = storage.get(name);
            return typeof res === 'string' ? res : null;
        },
        setItem: (name: string, value: string) => { storage.set(name, JSON.parse(value)) }
    }),
    blacklist: derivedFields
};

const createStore: StateCreator<IDataStore, DraftSetState<IDataStore>> = (set, get) => ({
    indexedCategories: {},
    events: {},
    eventsByDate: {},
    
    loadDerivedState: () => {
        let eventsByDate: { [date: string]: EventCollection } = {};
        for (let [category, activities] of Object.entries(get().events)) {
            for (let [activity, durations] of Object.entries(activities)) {
                for (let d of durations) {
                    const dateString = d.timeStart.toLocaleDateString();
                    if (!eventsByDate.hasOwnProperty(dateString)) {
                        eventsByDate[dateString] = {
                            [category]: { [activity]: [] }
                        };
                    }
                    eventsByDate[dateString][category][activity].push(d);
                }
            }
        }
        set(() => ({ eventsByDate }));
    },
    addEvent: (categoryName: string, activityName: string, duration: Duration) => {
        console.log(get().events)
        const startDateString = duration.timeStart.toLocaleDateString();
        set(state => {
            state.events[categoryName][activityName].push(duration);
            if (!state.eventsByDate[startDateString]) {
                state.eventsByDate[startDateString] = {
                    [categoryName]: { [activityName]: [] }
                };
            }
            state.eventsByDate[startDateString][categoryName][activityName].push(duration);
        });
    }
});

export const useDataStore = create<IDataStore>(
    persist(immer(createStore), persistOptions));
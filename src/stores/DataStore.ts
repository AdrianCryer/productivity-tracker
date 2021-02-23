import create, { State } from 'zustand';
import { Category, Duration, EventCollection } from '../core';

export interface IDataStore extends State {
    indexedCategories: { [name: string]: Category };
    events: EventCollection;
    addEvent: (categoryName: string, activityName: string, duration: Duration) => void;
};

export const useDataStore = create<IDataStore>((set, get) => ({
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
}));
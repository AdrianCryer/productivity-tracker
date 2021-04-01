import create, { State, StateCreator } from 'zustand';
import produce, { Draft } from 'immer';
import { persist } from 'zustand/middleware'

export type DraftSetState<T> = (fn: (draft: Draft<T>) => void) => void;
const immer = <T extends State>(
    config: StateCreator<T, DraftSetState<T>>
): StateCreator<T> => (set, get, api) => 
    config((fn) => set(produce(fn) as (state: T) => T), get, api);

export function createStore<T extends State>(
    store: StateCreator<T, DraftSetState<T>>,
    /** PersistOptions<T> not exported from zustand/middleware :( */
    persistOptions: any
) {
    // return create<T>(persist(immer(store), persistOptions));
    return create<T>(immer(store));
}
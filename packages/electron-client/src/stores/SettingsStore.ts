import create from 'zustand';

type ISettingsStore = {

};

export const SettingsStore = create<ISettingsStore>((set, get) => ({
    workDays: ['Mon', 'Tues']
}));
import { DateMeta } from "./date";


export type DataType = 'Date' | 'Duration' | 'Timestamp' | 'Time' | 'DateTime' | 'Week' | 'Year' | 'Number' | 'String';
export interface MetaType {
    name: DataType;
    props: any;
}

export default {
    DateMeta,
};
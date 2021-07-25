import firebase from "firebase/app";
import { 
    Record, 
    RecordSchema,
} from "./client-schema";
import Types from "./types";

/**
 * Deserialise a record recieved from the database.
 * 
 * @param record        The recieved record data. 
 * @param recordSchema  The schema of the record.
 */
export function deserialiseRecord(record: Record, recordSchema: RecordSchema) {

    let attributes = {
        ...Object.entries(recordSchema.key),
        ...Object.entries(recordSchema.value || {})
    };
    for (let [label, attributeSchema] of attributes) {
        let type;
        switch(attributeSchema.name) {
            case 'Date':
                type = Types.DateMeta;
                break;
            default:
                throw new Error(`Could not deserialise record ${record.id}. 
                    Unknown type ${attributeSchema.name}.`);
        }
        record.data[label] = type.deserialise(
            record.data[label],
            attributeSchema.props
        );
    }
}
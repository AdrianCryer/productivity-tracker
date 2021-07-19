import { Category, Activity, Record, RecordSchema } from "./client-schema";


/**
 * @example 
 * 
 * schema: {
 *      key: {
 *          "Time Start": { type: "Timestamp" },
 *          "Time End": { type: "Timestamp" },
 *      },
 *      lookup: {
 *          "Date": {
 *              function: ["Any", ""]
 *          }
 *      }
 * }
 */
export function getIndexedValues(schema: RecordSchema, indexName: string, record: Record) {
    
    if (!schema.indexes) return [];

    if (!(indexName in schema.indexes)) {
        // const 
    }
}

export function validateSchemaType(schema: RecordSchema) {
    // Validate schema indexes
}
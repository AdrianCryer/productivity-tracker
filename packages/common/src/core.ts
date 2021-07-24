import { Category, Activity, Record, RecordSchema, GroupBySchema, AttributeModifier } from "./client-schema";


// Recursive
export function validateGroupBySchema(groupBySchema: GroupBySchema, recordSchema: RecordSchema) {

    for (let modifier of groupBySchema) {
        if (typeof modifier === 'string' || modifier instanceof String) {

            // Check if attribute in record schema.
            if (!attributeInRecordSchema(modifier as string, recordSchema)) {
                throw new Error('Modifier: ' + modifier + ', has invalid format. Not found in record schema.');
            }
        } else {
            // Validate return types?

            validateGroupBySchema(modifier.params, recordSchema);
        }
    }
}

function attributeInRecordSchema(attribute: string, recordSchema: RecordSchema) {

    return (attribute in recordSchema.key || 
           (recordSchema.value && attribute in recordSchema.value)) ||
           (recordSchema.derived && attribute in recordSchema.derived);
}

function getParamGroupByValue(record: Record, param: string | AttributeModifier, recordSchema: RecordSchema): string {

    if (typeof param === 'string' || param instanceof String) {
        let attribute = param as string;
        if (recordSchema.derived && attribute in recordSchema.derived) {
            return getParamGroupByValue(record, recordSchema.derived[attribute], recordSchema);
        }
        return record.data[attribute].toString();

    } else {
        let modifier = param as AttributeModifier;
        if (modifier.function === 'Tuple') {

            let values = modifier.params.map(p => getParamGroupByValue(record, p, recordSchema));
            return formatAsTuple(...values);

        } else if (modifier.function === 'ToDateString') {
            // Check if single param  and is timestamp / date
            if (modifier.params.length > 1) {
                throw new Error(`Modifier ToDateString was provided with too 
                    many parameters. Got ${modifier.params.length} when 
                    expected 1.`);
            } 

            const param = getParamGroupByValue(record, modifier.params[0], recordSchema) as (string | Date);
            return (new Date(param)).toLocaleDateString();
        } else if (modifier.function === 'ToWeekString') {
            throw new Error(`Function 'ToWeekString' not yet supported.`)
        } else if (modifier.function === 'ToYearString') {
            throw new Error(`Function 'ToYearString' not yet supported.`)
        }
    }
    return "[No Group]";
}

function getRecordGroupValues(record: Record, groupBySchema: GroupBySchema, recordSchema: RecordSchema): string[] {
    
    let result = [];
    for (let modifier of groupBySchema) {
        result.push(getParamGroupByValue(record, modifier, recordSchema));
    }
    return result;
}

function formatAsString(indexValue: any): string {
    return indexValue.toString();
}

function formatAsTuple(...params: any[]): string {
    return '(' + params.map(p => formatAsString(p)).join(',') + ')';
}

export function buildGroupByIndex(records: Record[], groupBySchema: GroupBySchema, recordSchema: RecordSchema) {
    let index: { [label: string]: Record['id'][] } = {};
    for (let record of records) {
        for (let groupByValue of getRecordGroupValues(record, groupBySchema, recordSchema)) {
            if (!(groupByValue in index)) {
                index[groupByValue] = [];
            }
            index[groupByValue].push(record.id);
        }
    }
    return index;
}


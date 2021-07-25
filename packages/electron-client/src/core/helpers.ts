import { ActivitySchema, DataRecord, Duration, getRelevantTimes } from "@productivity-tracker/common/lib/schema";
import moment from "moment";

export function formatAMPM(date: Date): string {
    let hours = date.getHours();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let strTime = hours + ampm;
    return strTime;
}

type HourMinuteDuration = [hours: number, minutes: number];

export function getDurationFromDiff(diffMs: number): HourMinuteDuration {
    let hours = Math.floor((diffMs % 86400000) / 3600000);
    let minutes = Math.round(((diffMs % 86400000) % 3600000) / 60000) % 60;
    return [hours, minutes];
}

export function getDuration(start: Date, end: Date): HourMinuteDuration {
    return getDurationFromDiff((+end - +start));
}

export function getFormmattedDuration(start: Date, end: Date) {
    const [hours, minutes] = getDuration(start, end);
    return `${hours}h ${minutes}m`;
}

export function getDateString(dateString: string) {
    return (new Date(dateString)).toLocaleDateString();
}

export function getNumberOfWeek(date: Date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (+date - +firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export function recordTimeComparator(schema: ActivitySchema, a: DataRecord, b: DataRecord) {
    // Pick oldest from all indexable dates.
    const timesA = getRelevantTimes(a.data, schema).map(t => +(new Date(t)));
    const timesB = getRelevantTimes(b.data, schema).map(t => +(new Date(t)));
    return Math.max(...timesA) - Math.max(...timesB)
}

export function generateDataTableColumnFormat(schema: ActivitySchema) {
    // if (schema.key === 'Duration') {

    // }
}

// export function generateDataTableValue(schema: ActivitySchema, record: DataRecord) {
//     let tableRow: { key?: any; value?: any; } = {};
//     if (schema.key === 'Duration') {
//         const data = record.data as Duration;
//         tableRow.key = {
//             duration: getFormmattedDuration(
//                 new Date(data.timeStart), 
//                 new Date(data.timeEnd)
//             ),
//             timeStart: moment(data.timeStart),
//             timeEnd: moment(data.timeEnd),
//         };
//     } else if (schema.key === 'Timestamp') {
//         // Do stuff
//     } else if (schema.key === 'Week') {
//         // Do stuff
//     } else if (schema.key === 'Month') {
//         // Do stuff
//     } else if (schema.key === 'Year') {
//         // Do stuff
//     }

//     if (schema.valueType === '') {
        
//     }
// }
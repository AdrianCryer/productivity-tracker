
export function formatAMPM(date: Date): string {
    let hours = date.getHours();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let strTime = hours + ampm;
    return strTime;
}

export function formatDuration(start: Date, end: Date): string {
    let hours = Math.floor((+end - +start) / 3600000);
    let minutes = Math.round((+end - +start) / 60000 - hours * 60);
    return `${hours}h ${minutes}m`;
}
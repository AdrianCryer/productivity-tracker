import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Space } from 'antd';
import { TimelineBar, EventAdder, SummaryHeader } from '../components';
import { CategoryDurations } from '../core';
import { useDataStore } from '../stores/DataStore';


type HomeProps = {
    initialDate: Date,
};

export default function Home(props: HomeProps) {

    const store = useDataStore();
    const [currentDate, setCurrentDate] = useState(props.initialDate);

    const categoryDurations: CategoryDurations = useMemo(
        () => {

            const dateString = currentDate.toLocaleDateString();
            const events = store.eventsByDate[dateString] || [];
            const categoryDurations: CategoryDurations = {};

            for (let e of events) {
                if (!categoryDurations[e.categoryId]) {
                    categoryDurations[e.categoryId] = [];
                }
                categoryDurations[e.categoryId].push(e.duration);
            }
            return categoryDurations;
        },
        [store.events, currentDate]
    );

    const [hours, minutes] = useMemo(
        () => {
            const dateString = currentDate.toLocaleDateString();
            const events = store.eventsByDate[dateString] || [];

            const totalMs = events.reduce((total, e) => {
                const diff = +(new Date(e.duration.timeEnd)) - +(new Date(e.duration.timeStart));
                return total + diff;
            }, 0);

            return [
                Math.floor(totalMs / 3600000), 
                Math.floor((totalMs % 3600000) / 60000)
            ];
        },  
        [store.events, currentDate]
    );

    const onChangeDate = (date: Date) => {
        setCurrentDate(date);
    }

    return (
        <Space direction="vertical">
            {/* <h1>Active</h1> */}
            <EventAdder
                categories={store.categories}
                onAddEntry={data => {
                    const day = data.date.get("date");
                    const timeStart = data.timeStart.set("date", day).toDate();
                    const timeEnd = data.timeEnd.set("date", day).toDate();
                    store.addEvent(
                        data.category,
                        data.activity,
                        { timeStart, timeEnd }
                    );
                }}
            />
            <SummaryHeader 
                currentDate={currentDate}
                totalMinutes={minutes}
                totalHours={hours}
                onChangeDate={onChangeDate}
            />
            {Object.values(store.categories).map(category => (
                <TimelineBar
                    key={category.id}
                    day={currentDate}
                    durations={categoryDurations[category.id]}
                    tickerSpacing={4}
                    title={category.name}
                />
            ))}
        </Space>
    );
}

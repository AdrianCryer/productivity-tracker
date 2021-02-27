import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Space } from 'antd';
import { TimelineBar, EventAdder, SummaryHeader } from '../components';
import { CategoryDurations } from '../core';
import { useDataStore } from '../stores/DataStore';


type HomeProps = {
    currentDate: Date,
};

export default function Home(props: HomeProps) {

    const store = useDataStore();
    const categoryDurations: CategoryDurations = useMemo(
        () => {

            const dateString = props.currentDate.toLocaleDateString();
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
        [store.events]
    );

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
            <SummaryHeader currentDate={props.currentDate}/>
            {Object.values(store.categories).map(category => (
                <TimelineBar
                    key={category.id}
                    day={props.currentDate}
                    durations={categoryDurations[category.id]}
                    tickerSpacing={4}
                    title={category.name}
                />
            ))}
        </Space>
    );
}

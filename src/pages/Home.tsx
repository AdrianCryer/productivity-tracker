import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Space } from 'antd';
import { TimelineBar, EventAdder, SummaryHeader, PageHeading } from '../components';
import { CategoryDurations } from '../core';
import { useDataStore } from '../stores/DataStore';
import { getDurationFromDiff } from '../core/helpers';


type HomeProps = {
    initialDate: Date,
};

export default function Home(props: HomeProps) {

    const store = useDataStore();
    const [currentDate, setCurrentDate] = useState(props.initialDate);
    const eventsByDate = useDataStore(state => state.getEventsByDate(currentDate))

    const categoryDurations: CategoryDurations = useMemo(
        () => {
            const categoryDurations: CategoryDurations = {};
            for (let e of eventsByDate) {
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
            const totalMs = eventsByDate.reduce((total, e) => {
                const diff = +(new Date(e.duration.timeEnd)) - +(new Date(e.duration.timeStart));
                return total + diff;
            }, 0);

            return getDurationFromDiff(totalMs);
        },  
        [store.events, currentDate]
    );

    const onChangeDate = (date: Date) => {
        setCurrentDate(date);
    }

    return (
        <Space direction="vertical">
            <PageHeading title="Dashboard" />
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
                    durations={categoryDurations[category.id] || []}
                    tickerSpacing={4}
                    title={category.name}
                />
            ))}
        </Space>
    );
}

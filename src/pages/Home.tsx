import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Statistic, Row, Col, Button, Space } from 'antd';
import { TimelineBar, EventAdder } from '../components';
import { blue } from '@ant-design/colors';
import { Category, Duration, EventCollection } from '../core';
import { useDataStore } from '../stores/DataStore';


function getNumberOfWeek(date: Date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (+date - +firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

type HomeProps = {
    currentDate: Date,
    // dailyActivities: EventCollection;
    // categories: Category[];
};

type CategoryDurations = { [category: string]: Duration[] };

export default function Home(props: HomeProps) {

    const store = useDataStore();
    const categoryDurations: CategoryDurations = useMemo(
        () => {
            let durations: CategoryDurations = {};
            for (let category of Object.keys(store.events)) {
                let group: Duration[] = [];
                group = Object.values(store.events[category])
                                            .reduce((acc, d) => ([...acc, ...d]), []);

                // Make sure we are dealing with date objects
                group = group.map((d: Duration) => ({
                    timeStart: new Date(d.timeStart),
                    timeEnd: new Date(d.timeEnd)
                }));
                group.sort((a, b) => +a.timeEnd - +b.timeEnd);
                durations[category] = group;
            }
            return durations;
        },
        [store.events]
    );

    const getTimeStartArray = (durations: Duration[]): [Date[], Date[]] => {
        let start = [];
        let end = [];
        for (let { timeStart, timeEnd } of durations) {
            start.push(new Date(timeStart));
            end.push(new Date(timeEnd));
        }
        // for (let durations of Object.values(store.events[category])) {

        //     let durations.sort((a, b) => +a.timeEnd - +b.timeEnd);
        //     for (let { timeStart, timeEnd} of durations) {
        //         start.push(timeStart);
        //         end.push(timeEnd);
        //     }
        // }
        return [start, end];
    };

    return (
        <Space direction="vertical">
            {/* <h1>Active</h1> */}
            <EventAdder
                categories={store.indexedCategories}
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
            {/* <h1>Overview</h1>
            <Card>
                <Row>
                    <Col span={8}>
                        <Statistic title="Week" value={`${getNumberOfWeek(props.currentDate)} / 52`} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="Week" value={`${getNumberOfWeek(props.currentDate)} / 52`} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="Time today" value={"2h 31m"} precision={2} />
                    </Col>
                </Row>
            </Card> */}
            <h1>Today's progress</h1>
            {Object.keys(store.events).map(category => (
                <TimelineBar
                    key={category}
                    day={props.currentDate}
                    timeline={getTimeStartArray(categoryDurations[category])}
                    tickerSpacing={4}
                    title={category}
                />
            ))}
        </Space>
    );
}

import { Popconfirm } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import EditableTable, { DataColumn, DataRow } from "../../components/EditableTable";
import { getDateString, getFormmattedDuration } from "../../core/helpers";
import {  useDataStore } from "../../stores/DataStore";


const getColumns = (isEmpty: boolean, onDelete: (row: DataRow) => void): DataColumn[] => ([
    {
        title: 'Activity',
        dataIndex: 'activity',
    },
    {
        title: 'Duration',
        dataIndex: 'duration'
    },
    {
        title: 'Date',
        dataIndex: 'date'
    },
    {
        title: 'Time Start',
        dataIndex: 'timeStart',
        editable: true,
        width: '20%',
        cellType: 'timePicker'
    },
    {
        title: 'Time End',
        dataIndex: 'timeEnd',
        editable: true,
        width: '20%',
        cellType: 'timePicker'
    },
    {
        title: 'Modify',
        dataIndex: 'modify',
        render: (_, record: object ) => {
            const r = record as DataRow;
            return isEmpty ? (
                <Popconfirm title="Confirm delete?" onConfirm={() => onDelete(r)}>
                    <a>Delete</a>
                </Popconfirm>
            ) : null
        }
    },
]);

type DurationTableProps = { categoryId: number; activityId?: number, date: Date };

function DurationTable({ categoryId, activityId, date }: DurationTableProps) {

    const { updateEvent, deleteEvent } = useDataStore.getState();
    const eventsByDate = useDataStore(state => state.getEventsByDate(date));
    const activities = useDataStore(state => state.categories[categoryId].activities);
    
    let filteredEvents = activityId !== undefined ? 
        eventsByDate.filter(event => event.activityId === activityId) : 
        eventsByDate;
    filteredEvents = filteredEvents.filter(event => event.categoryId === categoryId);

    const tableData = filteredEvents.map(event => ({
        id: event.id,
        key: event.id,
        activity: activities[event.activityId].name,
        date: getDateString(event.duration.timeStart),
        duration: getFormmattedDuration(
            new Date(event.duration.timeStart), 
            new Date(event.duration.timeEnd)
        ),
        timeStart: moment(event.duration.timeStart),
        timeEnd: moment(event.duration.timeEnd),
    }));

    const onUpdate = (row: DataRow) => {
        updateEvent({
            id: row.id,
            duration: {
                timeStart: row.timeStart.toDate().toISOString(),
                timeEnd: row.timeEnd.toDate().toISOString()
            }
        })
    };

    const onDelete = (row: DataRow) => {
        deleteEvent(row.id);
    };

    return (
        <EditableTable
            columns={getColumns(tableData.length > 0, onDelete)}
            onUpdate={onUpdate}
            onDelete={onDelete}
            data={tableData}
        />
    );
}

export default React.memo(DurationTable);
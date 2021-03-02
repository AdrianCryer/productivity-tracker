import { Popconfirm } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import EditableTable, { DataColumn, DataRow } from "../../components/EditableTable";
import { formatDuration } from "../../core/helpers";
import { useDataStore } from "../../stores/DataStore";


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
        title: 'Time Start',
        dataIndex: 'timeStart',
        editable: true,
        width: '30%',
        cellType: 'timePicker'
    },
    {
        title: 'Time End',
        dataIndex: 'timeEnd',
        editable: true,
        width: '30%',
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

type DurationTableProps = { categoryId: number; activityId: number };

function DurationTable({ categoryId, activityId }: DurationTableProps) {

    const { updateEvent, removeEvent } = useDataStore.getState();

    const key = new String([categoryId, activityId]) as string;
    const eventsByActivity = useDataStore(state => state.eventsByActivity[key] || []);
    const activity = useDataStore(state => state.categories[categoryId].activities[activityId]);

    const tableData = eventsByActivity.map(event => ({
        id: event.id,
        key: event.id,
        activity: activity.name,
        duration: formatDuration(
            new Date(event.duration.timeStart), 
            new Date(event.duration.timeEnd)
        ),
        timeStart: moment(event.duration.timeStart),
        timeEnd: moment(event.duration.timeEnd),
    }));

    const onUpdate = (row: DataRow) => {
        updateEvent({
            id: row.id,
            activityId: activity.id,
            categoryId: categoryId,
            duration: {
                timeStart: row.timeStart.toDate().toISOString(),
                timeEnd: row.timeEnd.toDate().toISOString()
            }
        })
    };

    const onDelete = (row: DataRow) => {
        removeEvent(row.id);
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
import { Popconfirm } from "antd";
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
    },
    {
        title: 'Time End',
        dataIndex: 'timeEnd',
        editable: true,
        width: '30%',
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

export default function DurationTable({ categoryId, activityId }: DurationTableProps) {

    const [tableData, setTableData] = useState<DataRow[]>([]);
    const { updateEvent, removeEvent } = useDataStore();

    const key = new String([categoryId, activityId]) as string;
    const eventsByActivity = useDataStore(state => (state.eventsByActivity[key] || []));
    const activity = useDataStore(state => state.categories[categoryId].activities[activityId]);

    useEffect(() => {
        const tableData = eventsByActivity.map(event => ({
            id: event.id,
            key: event.id,
            activity: activity.name,
            duration: formatDuration(
                new Date(event.duration.timeStart), 
                new Date(event.duration.timeEnd)
            ),
            timeStart: event.duration.timeStart,
            timeEnd: event.duration.timeEnd,
        }));
        setTableData(tableData);
    }, [eventsByActivity]);

    const onUpdate = (row: DataRow) => {
        const nextData = [...tableData];
        const index = nextData.findIndex(item => row.key === item.key);
        const item = nextData[index];
        nextData.splice(index, 1, { ...item, ...row });
        setTableData(nextData);
    };

    const onDelete = (row: DataRow) => {
        removeEvent(row.id);
        setTableData(data => data.filter(item => item.key !== row.key));
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
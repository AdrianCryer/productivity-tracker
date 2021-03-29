import { Popconfirm } from "antd";
import moment from "moment";
import React, { useContext } from "react";
import EditableTable, { DataColumn, DataRow } from "../../components/EditableTable";
import { getDateString, getFormmattedDuration } from "../../core/helpers";
import {  useDataStore } from "../../stores/DataStore";
import { useRecordStore } from "../../stores/RecordStore";


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

type DurationTableProps = { categoryId: string; activityId?: string, date: Date };

function DurationTable({ categoryId, activityId, date }: DurationTableProps) {

    const { updateEvent, deleteEvent } = useDataStore.getState();
    const activities = useRecordStore(state => state.categories[categoryId].activities);
    const recordsByDate = useRecordStore(state => state.getRecordsByDate(date));
    
    let filteredRecords = activityId !== undefined ? 
        recordsByDate.filter(record => record.activityId === activityId) : 
        recordsByDate;
    filteredRecords = filteredRecords.filter(record => record.categoryId === categoryId);

    const tableData = filteredRecords.map(record => ({
        id: record.id,
        key: record.id,
        activity: activities[record.activityId].name,
        // date: getDateString(record.duration.timeStart),
        // duration: getFormmattedDuration(
        //     new Date(record.duration.timeStart), 
        //     new Date(record.duration.timeEnd)
        // ),
        // timeStart: moment(record.duration.timeStart),
        // timeEnd: moment(record.duration.timeEnd),
    }));

    const onUpdate = (row: DataRow) => {
        // updateEvent({
        //     id: row.id,
        //     duration: {
        //         timeStart: row.timeStart.toDate().toISOString(),
        //         timeEnd: row.timeEnd.toDate().toISOString()
        //     }
        // })
    };

    const onDelete = (row: DataRow) => {
        // deleteEvent(row.id);
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
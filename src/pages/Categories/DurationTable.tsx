import { Popconfirm } from "antd";
import React, { useState } from "react";
import EditableTable, { DataColumn, DataRow } from "../../components/EditableTable";
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
        editable: true
    },
    {
        title: 'Time End',
        dataIndex: 'timeEnd',
        editable: true
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

type DurationTableProps = { initialData: DataRow[] };

export default function DurationTable(props: DurationTableProps) {

    const [tableData, setTableData] = useState(props.initialData);
    const { updateEvent, removeEvent } = useDataStore();

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
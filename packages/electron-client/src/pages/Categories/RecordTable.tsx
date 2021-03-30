import { Popconfirm } from "antd";
import moment from "moment";
import React, { useContext } from "react";
import EditableTable, { DataColumn, DataRow } from "../../components/EditableTable";
import { getFormmattedDuration } from "../../core/helpers";
import { useRecordStore } from "../../stores/RecordStore";
import { 
    ColumnDescription, 
    DataRecord,
    Duration,
    RecordSchema,
    TimedString 
} from "@productivity-tracker/common/lib/schema";
import { FirebaseContext } from "@productivity-tracker/common/lib/firestore";


function generateTableColumns(
    description: ColumnDescription, isEmpty: boolean, 
    onDelete: (row: DataRow) => void
): DataColumn[] {

    let extra: DataColumn[] = [];
    if (description === 'Duration') {
        extra = [
            {
                title: 'Duration',
                dataIndex: 'duration'
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
        ]
    } else if (description === 'TimedString') {
        extra = [
            {
                title: 'Value',
                dataIndex: 'value'
            }
        ]
    }

    return [
        {
            title: 'Activity',
            dataIndex: 'activity',
        },
        ...extra,
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
    ]
}

function mapRecordToColumn(record: DataRecord, schema: RecordSchema) {
    if (schema.type === 'Duration') {
        const data = record.data as Duration;
        return {
            duration: getFormmattedDuration(
                new Date(data.timeStart), 
                new Date(data.timeEnd)
            ),
            timeStart: moment(data.timeStart),
            timeEnd: moment(data.timeEnd),
        };
    } else if (schema.type === 'TimedString') {
        const data = record.data as TimedString;
        return { value: data.value };
    } else {
        throw new Error(`Invalid record encountered '${record.id}' with
            unknown type ${schema.type}`);
    }
}

type RecordTableProps = { 
    categoryId: string; 
    activityId: string, 
    date: Date 
};

export default function RecordTable({ categoryId, activityId, date }: RecordTableProps) {

    // Grab the firebase context
    const firebaseHandler = useContext(FirebaseContext);

    const { updateRecord, deleteRecord } = useRecordStore.getState();
    const activity = useRecordStore(state => state.activities[activityId]);
    const recordsByDate = useRecordStore(state => state.getRecordsByDate(date));

    let filteredRecords = activityId !== undefined ? 
        recordsByDate.filter(record => record.activityId === activityId) : 
        recordsByDate;
    filteredRecords = filteredRecords.filter(record => record.categoryId === categoryId);

    const tableData = filteredRecords.map(record => ({
        id: record.id,
        key: record.id,
        activity: activity.name,
        ...mapRecordToColumn(record, activity.schema)
    }));

    const onUpdate = (row: DataRow) => {
        // updateRecord({
        //     id: row.id,
        //     duration: {
        //         timeStart: row.timeStart.toDate().toISOString(),
        //         timeEnd: row.timeEnd.toDate().toISOString()
        //     }
        // })
    };

    const onDelete = (row: DataRow) => {
        // firebaseHandler.removeRecord(row.id);
        // deleteRecord(row.id);
    };

    const columns = generateTableColumns(activity.schema.type, tableData.length > 0, onDelete);

    return (
        <EditableTable
            columns={columns}
            onUpdate={onUpdate}
            onDelete={onDelete}
            data={tableData}
        />
    );

}
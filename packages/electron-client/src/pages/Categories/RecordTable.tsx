import { Popconfirm } from "antd";
import moment from "moment";
import React, { useCallback, useContext } from "react";
import EditableTable, { DataColumn, DataRow } from "../../components/EditableTable";
import { getFormmattedDuration } from "../../core/helpers";
import { useRecordStore } from "../../stores/RecordStore";
import { 
    Activity,
    DataRecordDescription, 
    DataRecord,
    Duration,
    ActivitySchema,
    TimedString 
} from "@productivity-tracker/common/lib/schema";
import { FirebaseContext } from "@productivity-tracker/common/lib/firestore";


function generateTableColumns(
    description: DataRecordDescription, isEmpty: boolean, 
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

function mapRecordToColumn(record: DataRecord, schema: ActivitySchema) {
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
    activity: Activity;
    date: Date;
};

export default function RecordTable({ activity, date }: RecordTableProps) {

    // Grab the firebase context
    const firebaseHandler = useContext(FirebaseContext);
    const recordsByDate = useRecordStore(
        useCallback(
            state => state.getRecordsByDate(date),
            [date],
        )
    );
    const activityId = activity.id;
    let filteredRecords = recordsByDate.filter(record => record.activityId === activityId);

    // Memo this.
    const tableData = filteredRecords.map(record => ({
        id: record.id,
        key: record.id,
        activity: activity.name,
        ...mapRecordToColumn(record, activity.schema)
    }));

    const onUpdate = async (row: DataRow) => {

        if (activity.schema.type === 'Duration') {
            firebaseHandler.editRecord({
                id: row.id,
                data: {
                    timeStart: row.timeStart.toDate(),
                    timeEnd: row.timeEnd.toDate()
                }
            })
        } else {
            console.log("Can't update yet.. not implemented")
        }
    };

    const onDelete = async (row: DataRow) => {
        firebaseHandler.removeRecord(row.id);
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
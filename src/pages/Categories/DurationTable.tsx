import EditableTable from "../../components/EditableTable";

const columns = [
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
];

type DurationTableProps = { data: { key: string; [key: string]: any }[] };
export default function DurationTable(props: DurationTableProps) {
    return (
        <EditableTable
            columns={columns}
            data={props.data}
        />
    );
}
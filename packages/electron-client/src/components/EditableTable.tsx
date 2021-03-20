import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Form, FormInstance, Input, Table, TimePicker } from "antd";

const EditableContext = createContext<FormInstance<any> | null>(null);

type TableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<TableProps['columns'], undefined>;

export type DataRow = {
    id: number; 
    key: React.Key; 
    [other: string]: any 
};
export type CellType =  'input' | 'timePicker';
export type DataColumn = (ColumnTypes[number] & { 
    dataIndex: string; 
    editable?: boolean; 
    cellType?: CellType;
});

interface EditableTableProps extends Omit<TableProps, 'columns'> {
    columns: DataColumn[];
    data: DataRow[];
    onUpdate: (row: DataRow) => void;
    onDelete: (row: DataRow) => void;
};

type EditableRowProps = { index: number };

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    cellType: CellType;
    children: React.ReactNode;
    dataIndex: string;
    record: any;
    handleSave: (record: any) => void;
}

export default function EditableTable(props: EditableTableProps) {

    const components = {
        body: { row: EditableRow, cell: EditableCell }
    };

    const columns = props.columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: any) => ({
                record,
                editable: col.editable,
                cellType: col.cellType,
                dataIndex: col.dataIndex,
                title: col.title, 
                handleSave: props.onUpdate,
            }),
        }
    })

    return (
        <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={props.data}
            columns={columns as ColumnTypes}
        />
    )
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    cellType,
    children,
    dataIndex,
    record,
    handleSave,
    ...props
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<Input>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;
    if (editable) {
        childNode = (editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                {cellType  === 'timePicker' ? (
                    <TimePicker ref={inputRef} onChange={save} onBlur={save} />
                ): (
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                )}
            </Form.Item>
        ) : (
            <div 
                style={{ paddingRight: 24, padding: '5px 12px', cursor: 'pointer' }} 
                onClick={toggleEdit}
            >
                {cellType === 'timePicker' ? (
                    (new Date(record[dataIndex])).toLocaleTimeString()
                ) : children}
            </div>
        ));
    }

    return <td {...props}>{childNode}</td>;
}